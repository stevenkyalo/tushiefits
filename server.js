import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import expressLayouts from 'express-ejs-layouts'  // ADD THIS
import prisma from './src/lib/prisma.js'
import productRoutes from './src/routes/products.js'
import adminRoutes from './src/routes/admin.js'
import mpesaRoutes from './src/routes/mpesa.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
//trigger redeploy
const app = express()
const PORT = process.env.PORT || 5000

// ============ MIDDLEWARE ============
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// ============ EJS SETUP ============
app.use(expressLayouts)  // ADD THIS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('layout', 'layout')  // ADD THIS - tells Express to use layout.ejs

// ============ API ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '✅ TushieFits backend is running!',
    timestamp: new Date().toISOString()
  })
})

// Database test
app.get('/api/db-test', async (req, res) => {
  try {
    const productCount = await prisma.product.count()
    res.json({ 
      message: '✅ Database connected successfully!',
      productsInDatabase: productCount
    })
  } catch (error) {
    res.status(500).json({ 
      message: '❌ Database connection failed',
      error: error.message
    })
  }
})

// Product CRUD routes
app.use('/api/products', productRoutes)

// Admin routes
app.use('/admin', adminRoutes)

// ============ CUSTOMER ROUTES ============

// Homepage
app.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
      orderBy: { createdAt: 'desc' }
    })
    
    const featuredProducts = products.filter(p => p.featured)
    
    res.render('customer/index', {
      title: 'Home',
      products: products.slice(0, 8),
      featuredProducts: featuredProducts.slice(0, 4)
    })
  } catch (error) {
    console.error('Homepage error:', error)
    res.status(500).send('Error loading homepage')
  }
})

// Product listing
app.get('/products', async (req, res) => {
  try {
    const { category } = req.query
    const where = { inStock: true }
    if (category) where.category = category
    
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    
    res.render('customer/products', {
      title: 'All Products',
      products
    })
  } catch (error) {
    console.error('Products error:', error)
    res.status(500).send('Error loading products')
  }
})

// Product detail
app.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await prisma.product.findUnique({
      where: { id }
    })
    
    if (!product) {
      return res.status(404).send('Product not found')
    }
    
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: id },
        inStock: true
      },
      take: 4
    })
    
    res.render('customer/product-detail', {
      title: product.name,
      product,
      relatedProducts
    })
  } catch (error) {
    console.error('Product detail error:', error)
    res.status(500).send('Error loading product')
  }
})

// Cart page
app.get('/cart', (req, res) => {
  res.render('customer/cart', {
    title: 'Shopping Cart'
  })
})

// Checkout page
app.get('/checkout', (req, res) => {
  res.render('customer/checkout', {
    title: 'Checkout'
  })
})

// Order confirmation
app.get('/order-confirmation/:id', async (req, res) => {
  try {
    const { id } = req.params
    const order = await prisma.order.findUnique({
      where: { id }
    })
    
    if (!order) {
      return res.status(404).send('Order not found')
    }
    
    res.render('customer/order-confirmation', {
      title: 'Order Confirmed',
      order
    })
  } catch (error) {
    console.error('Order confirmation error:', error)
    res.status(500).send('Error loading order')
  }
})

// Create order API
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, paymentMethod, items, total } = req.body
    
    const orderNumber = `TF-${Date.now().toString().slice(-6)}`
    
    const customer = await prisma.customer.create({
      data: {
        email: `guest-${Date.now()}@tushiefits.com`,
        password: 'guest',
        firstName: customerName.split(' ')[0] || 'Guest',
        lastName: customerName.split(' ').slice(1).join(' ') || 'Customer',
        phone: customerPhone,
        address: customerAddress
      }
    })
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        totalAmount: total,
        paymentMethod,
        shippingAddress: customerAddress,
        shippingCity: 'Nairobi',
        shippingCounty: 'Nairobi',
        phone: customerPhone,
        status: 'PENDING',
        paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PENDING'
      }
    })
    
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }
      })
    }
    
    res.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})


// ============ ADMIN ORDER ROUTES ============

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({
      success: true,
      orders
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Update order status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    })
    
    res.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Error updating order:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`🚀 TushieFits server is running on http://localhost:${PORT}`)
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin/dashboard`)
  console.log(`🛍️  Customer Store: http://localhost:${PORT}`)
  console.log(`📦 Add Product: http://localhost:${PORT}/admin/add-product`)
})