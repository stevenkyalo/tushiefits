import fs from 'fs'
import path from 'path'
import FormData from 'form-data'
import fetch from 'node-fetch'
import prisma from './src/lib/prisma.js'

const BASE_URL = 'http://localhost:5000'

async function resetProducts() {
  console.log('🔄 Starting product reset...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    // Step 1: Get all existing products
    console.log('📋 Fetching existing products...')
    const response = await fetch(`${BASE_URL}/api/products`)
    const data = await response.json()
    
    if (!data.success) {
      console.error('❌ Failed to fetch products:', data.error)
      return
    }

    const products = data.products || []
    console.log(`📊 Found ${products.length} products to delete`)

    // Step 2: Delete all products
    for (const product of products) {
      console.log(`🗑️  Deleting: ${product.name} (${product.id})`)
      const deleteResponse = await fetch(`${BASE_URL}/api/products/${product.id}`, {
        method: 'DELETE'
      })
      const deleteData = await deleteResponse.json()
      if (deleteData.success) {
        console.log(`   ✅ Deleted successfully`)
      } else {
        console.log(`   ❌ Failed: ${deleteData.error}`)
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // Step 3: Add Sample Product 1 - Ankara Dress
    console.log('📦 Adding Sample Product 1: Ankara Print Maxi Dress')
    const formData1 = new FormData()
    formData1.append('name', 'Ankara Print Maxi Dress')
    formData1.append('description', 'Beautiful Ankara print maxi dress with a flattering silhouette. Perfect for weddings, church, or casual outings. Made with high-quality African wax print fabric.')
    formData1.append('price', '3500')
    formData1.append('category', 'Dresses')
    formData1.append('subCategory', 'Maxi')
    formData1.append('gender', 'Women')
    formData1.append('sizes', JSON.stringify(['S', 'M', 'L', 'XL']))
    formData1.append('colors', JSON.stringify(['Red', 'Blue', 'Yellow']))
    formData1.append('material', 'Cotton Ankara')
    formData1.append('inStock', 'true')
    formData1.append('featured', 'true')
    
    // Add the image from root folder
    const imagePath = path.join(process.cwd(), 'ankara.jpeg')
    if (fs.existsSync(imagePath)) {
      formData1.append('images', fs.createReadStream(imagePath))
      console.log('   📸 Using image: ankara.jpeg')
    } else {
      console.log('   ⚠️  Warning: ankara.jpeg not found in root folder')
    }

    const response1 = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      body: formData1,
      headers: formData1.getHeaders()
    })
    const product1 = await response1.json()
    if (product1.success) {
      console.log(`   ✅ Added: ${product1.product.name} (ID: ${product1.product.id})`)
      console.log(`   📸 Images: ${product1.product.images.length > 0 ? product1.product.images.join(', ') : 'No images'}`)
    } else {
      console.log(`   ❌ Failed: ${product1.error}`)
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // Step 4: Add Sample Product 2 - Lace Front Wig
    console.log('📦 Adding Sample Product 2: Lace Front Wig - Kinky Straight')
    const formData2 = new FormData()
    formData2.append('name', 'Lace Front Wig - Kinky Straight')
    formData2.append('description', 'Premium quality lace front wig with kinky straight texture. 100% human hair, pre-plucked hairline, natural baby hairs. Perfect for everyday wear or special occasions.')
    formData2.append('price', '8500')
    formData2.append('category', 'Wigs')
    formData2.append('subCategory', 'Lace Front')
    formData2.append('gender', 'Women')
    formData2.append('sizes', JSON.stringify(['Small', 'Medium', 'Large']))
    formData2.append('colors', JSON.stringify(['Black', 'Dark Brown', 'Light Brown']))
    formData2.append('material', 'Human Hair')
    formData2.append('inStock', 'true')
    formData2.append('featured', 'true')
    
    // Add the same image from root folder (or use a placeholder URL)
    if (fs.existsSync(imagePath)) {
      formData2.append('images', fs.createReadStream(imagePath))
      console.log('   📸 Using image: ankara.jpeg')
    } else {
      console.log('   ⚠️  Warning: ankara.jpeg not found, using placeholder')
      formData2.append('images', JSON.stringify(['https://via.placeholder.com/500x600/FF5733/FFFFFF?text=TushieFits-Wig']))
    }

    const response2 = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      body: formData2,
      headers: formData2.getHeaders()
    })
    const product2 = await response2.json()
    if (product2.success) {
      console.log(`   ✅ Added: ${product2.product.name} (ID: ${product2.product.id})`)
      console.log(`   📸 Images: ${product2.product.images.length > 0 ? product2.product.images.join(', ') : 'No images'}`)
    } else {
      console.log(`   ❌ Failed: ${product2.error}`)
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Reset complete!')

    // Show final product count
    const finalResponse = await fetch(`${BASE_URL}/api/products`)
    const finalData = await finalResponse.json()
    if (finalData.success) {
      console.log(`📊 Total products in database: ${finalData.products.length}`)
      console.log('\n📋 Products:')
      finalData.products.forEach((p, index) => {
        console.log(`   ${index + 1}. ${p.name} - KSh ${p.price.toLocaleString()}`)
        console.log(`      📸 ${p.images.length > 0 ? p.images.join(', ') : 'No images'}`)
      })
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
  }
}

resetProducts()