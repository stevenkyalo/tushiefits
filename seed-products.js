import prisma from './src/lib/prisma.js'

const sampleProducts = [
  // ===== DRESSES =====
  {
    name: "Ankara Print Maxi Dress",
    description: "Beautiful Ankara print maxi dress with a flattering silhouette. Perfect for weddings, church, or casual outings. Made with high-quality African wax print fabric.",
    price: 3500,
    category: "Dresses",
    subCategory: "Maxi",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&h=500&fit=crop"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Blue", "Yellow"],
    material: "Cotton Ankara",
    inStock: true,
    featured: true
  },
  {
    name: "Kente Print Midi Dress",
    description: "Vibrant Kente print midi dress with a fitted bodice and flowing skirt. Perfect for parties and special occasions.",
    price: 4200,
    category: "Dresses",
    subCategory: "Midi",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=500&fit=crop"],
    sizes: ["S", "M", "L"],
    colors: ["Gold", "Red", "Black"],
    material: "Cotton",
    inStock: true,
    featured: true
  },
  {
    name: "Lace Bodycon Dress",
    description: "Elegant lace bodycon dress with a flattering fit. Perfect for date nights, parties, and special events.",
    price: 2800,
    category: "Dresses",
    subCategory: "Bodycon",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&h=500&fit=crop"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Nude", "Red"],
    material: "Lace",
    inStock: true,
    featured: false
  },
  {
    name: "Kitenge Off-Shoulder Dress",
    description: "Stunning Kitenge off-shoulder dress with a dramatic slit. Perfect for weddings, graduations, and formal events.",
    price: 5500,
    category: "Dresses",
    subCategory: "Off-Shoulder",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=500&fit=crop"],
    sizes: ["M", "L", "XL"],
    colors: ["Purple", "Green", "Orange"],
    material: "Cotton Kitenge",
    inStock: true,
    featured: false
  },
  {
    name: "African Print Wrap Dress",
    description: "Versatile African print wrap dress that flatters all body types. Easy to wear and style for any occasion.",
    price: 3900,
    category: "Dresses",
    subCategory: "Wrap",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=500&fit=crop"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "White", "Red"],
    material: "Cotton",
    inStock: true,
    featured: false
  },

  // ===== WIGS =====
  {
    name: "Lace Front Wig - Kinky Straight",
    description: "Premium quality lace front wig with kinky straight texture. 100% human hair, pre-plucked hairline, natural baby hairs. Perfect for everyday wear or special occasions.",
    price: 8500,
    category: "Wigs",
    subCategory: "Lace Front",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&h=500&fit=crop"],
    sizes: ["Small", "Medium", "Large"],
    colors: ["Black", "Dark Brown", "Light Brown"],
    material: "Human Hair",
    inStock: true,
    featured: true
  },
  {
    name: "Full Lace Wig - Deep Wave",
    description: "Full lace wig with deep wave texture. 100% virgin human hair, 250% density, natural scalp appearance.",
    price: 12000,
    category: "Wigs",
    subCategory: "Full Lace",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1584395630827-6ad6ef1765b9?w=500&h=500&fit=crop"],
    sizes: ["Medium", "Large"],
    colors: ["Black", "Brown", "Burgundy"],
    material: "Virgin Human Hair",
    inStock: true,
    featured: true
  },
  {
    name: "U-Part Wig - Body Wave",
    description: "U-part wig with body wave texture. Easy to install, leaves your own hair out for a natural blend.",
    price: 7500,
    category: "Wigs",
    subCategory: "U-Part",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1561727888-82f694e1f84f?w=500&h=500&fit=crop"],
    sizes: ["Small", "Medium", "Large"],
    colors: ["Black", "Dark Brown"],
    material: "Human Hair",
    inStock: true,
    featured: false
  },
  {
    name: "Headband Wig - Curly",
    description: "Headband wig with curly texture. No glue, no lace, just put on and go! Perfect for busy women.",
    price: 4500,
    category: "Wigs",
    subCategory: "Headband",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&h=500&fit=crop"],
    sizes: ["Small", "Medium", "Large"],
    colors: ["Black", "Brown", "Blonde"],
    material: "Synthetic Hair",
    inStock: true,
    featured: false
  },

  // ===== TOPS =====
  {
    name: "Ankara Peplum Top",
    description: "Stylish Ankara peplum top with a modern cut. Perfect for work, casual outings, or pairing with jeans.",
    price: 2200,
    category: "Tops",
    subCategory: "Peplum",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=500&h=500&fit=crop"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Orange", "Green"],
    material: "Cotton Ankara",
    inStock: true,
    featured: false
  },
  {
    name: "Off-Shoulder Blouse",
    description: "Elegant off-shoulder blouse with puff sleeves. Perfect for date nights and summer days.",
    price: 1800,
    category: "Tops",
    subCategory: "Off-Shoulder",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1556048219-bcf83c077bf6?w=500&h=500&fit=crop"],
    sizes: ["S", "M", "L"],
    colors: ["White", "Black", "Navy"],
    material: "Cotton",
    inStock: true,
    featured: false
  },

  // ===== JUMPSUITS =====
  {
    name: "Ankara Jumpsuit - Wide Leg",
    description: "Stunning Ankara jumpsuit with wide legs and a flattering waist tie. Perfect for weddings, parties, and special events.",
    price: 4800,
    category: "Jumpsuits",
    subCategory: "Wide Leg",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Blue", "Yellow"],
    material: "Cotton Ankara",
    inStock: true,
    featured: true
  },
  {
    name: "African Print Romper",
    description: "Cute African print romper with a playful design. Perfect for casual outings and summer days.",
    price: 3200,
    category: "Jumpsuits",
    subCategory: "Romper",
    gender: "Women",
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop"],
    sizes: ["S", "M", "L"],
    colors: ["Green", "Purple", "Orange"],
    material: "Cotton",
    inStock: true,
    featured: false
  }
]

async function seedProducts() {
  console.log('🌱 Seeding sample products...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    // Check if products already exist
    const existingProducts = await prisma.product.count()
    
    if (existingProducts > 0) {
      console.log(`📊 Found ${existingProducts} existing products.`)
      console.log('⚠️  Do you want to delete existing products and add new samples?')
      console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...')
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      console.log('🗑️  Deleting existing products...')
      
      // First, delete all order items linked to products
      console.log('   Deleting order items...')
      await prisma.orderItem.deleteMany()
      
      // Then delete all cart items
      console.log('   Deleting cart items...')
      await prisma.cartItem.deleteMany()
      
      // Then delete the products
      console.log('   Deleting products...')
      await prisma.product.deleteMany()
      
      console.log('✅ All existing products and related data cleared.')
    }

    console.log('📦 Adding sample products...')
    
    for (const product of sampleProducts) {
      const created = await prisma.product.create({
        data: product
      })
      console.log(`   ✅ ${created.name} - KSh ${created.price.toLocaleString()}`)
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ Successfully added ${sampleProducts.length} sample products!`)
    console.log('📊 Total products in database:', await prisma.product.count())
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📝 Product Categories:')
    console.log(`   👗 Dresses: ${sampleProducts.filter(p => p.category === 'Dresses').length}`)
    console.log(`   💇 Wigs: ${sampleProducts.filter(p => p.category === 'Wigs').length}`)
    console.log(`   👚 Tops: ${sampleProducts.filter(p => p.category === 'Tops').length}`)
    console.log(`   👖 Jumpsuits: ${sampleProducts.filter(p => p.category === 'Jumpsuits').length}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🚀 Visit your store: http://localhost:5000')
    console.log('📊 Admin Dashboard: http://localhost:5000/admin/dashboard')

  } catch (error) {
    console.error('❌ Error seeding products:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

seedProducts()