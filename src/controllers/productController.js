import prisma from '../lib/prisma.js'

// Get all products (for admin)
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get single product
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await prisma.product.findUnique({
      where: { id }
    })
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    res.json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Create a new product (with image upload)
export const createProduct = async (req, res) => {
  try {
    const { 
      name, description, price, category, subCategory, 
      gender, sizes, colors, material, inStock, featured 
    } = req.body

    // Handle image uploads
    let imageUrls = []
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `/uploads/${file.filename}`)
    }

    // Parse sizes and colors (they come as JSON strings from the form)
    const parsedSizes = sizes ? JSON.parse(sizes) : []
    const parsedColors = colors ? JSON.parse(colors) : []

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        subCategory: subCategory || null,
        gender: gender || null,
        images: imageUrls,
        sizes: parsedSizes,
        colors: parsedColors,
        material: material || null,
        inStock: inStock === 'true',
        featured: featured === 'true'
      }
    })

    res.status(201).json({ success: true, product })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { 
      name, description, price, category, subCategory, 
      gender, sizes, colors, material, inStock, featured 
    } = req.body

    // Handle new images if uploaded
    let imageUrls = undefined
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `/uploads/${file.filename}`)
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        subCategory: subCategory || null,
        gender: gender || null,
        images: imageUrls,
        sizes: sizes ? JSON.parse(sizes) : undefined,
        colors: colors ? JSON.parse(colors) : undefined,
        material: material || null,
        inStock: inStock === 'true',
        featured: featured === 'true'
      }
    })

    res.json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.product.delete({ where: { id } })
    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}