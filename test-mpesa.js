import dotenv from 'dotenv'
import { Mpesa } from 'mpesa-app'

dotenv.config()

console.log('🔍 Diagnosing M-Pesa Configuration...')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// Check environment variables
console.log('📋 Environment Variables:')
console.log(`   MPESA_CONSUMER_KEY: ${process.env.MPESA_CONSUMER_KEY ? '✅ Set' : '❌ Missing'}`)
console.log(`   MPESA_CONSUMER_SECRET: ${process.env.MPESA_CONSUMER_SECRET ? '✅ Set' : '❌ Missing'}`)
console.log(`   MPESA_SHORTCODE: ${process.env.MPESA_SHORTCODE || '❌ Missing'}`)
console.log(`   MPESA_PASSKEY: ${process.env.MPESA_PASSKEY ? '✅ Set' : '❌ Missing'}`)
console.log(`   MPESA_ENVIRONMENT: ${process.env.MPESA_ENVIRONMENT || 'sandbox (default)'}`)

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

try {
  // Initialize M-Pesa client
  const mpesa = new Mpesa({
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    shortCode: process.env.MPESA_SHORTCODE || '174379',
    passkey: process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
  })

  console.log('✅ M-Pesa client initialized successfully')

  // Test STK Push
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📱 Attempting STK Push Test...')
  console.log('   Phone: 254708374149 (Safaricom Sandbox)')
  console.log('   Amount: 1')
  
  const response = await mpesa.stkPush({
    phone: '254708374149',
    amount: 1,
    accountReference: 'TEST-001',
    transactionDesc: 'Diagnostic test payment',
    callbackUrl: 'https://webhook.site/' // Temporary URL for testing
  })

  console.log('✅ STK Push Response:')
  console.log(`   Response Code: ${response.ResponseCode}`)
  console.log(`   Response Description: ${response.ResponseDescription}`)
  console.log(`   Checkout Request ID: ${response.CheckoutRequestID}`)
  console.log(`   Merchant Request ID: ${response.MerchantRequestID}`)

  if (response.ResponseCode === '0') {
    console.log('✅ SUCCESS! The STK Push was sent to the test phone.')
    console.log('📱 Check the phone for the M-Pesa prompt.')
  } else {
    console.log(`❌ STK Push failed with code: ${response.ResponseCode}`)
    console.log(`   Message: ${response.ResponseDescription}`)
  }

} catch (error) {
  console.error('❌ ERROR:')
  console.error(`   Message: ${error.message}`)
  console.error(`   Stack: ${error.stack}`)
  
  // Check for common issues
  if (error.message.includes('consumerKey') || error.message.includes('consumerSecret')) {
    console.log('🔧 TIP: Check your Consumer Key and Secret in .env')
  } else if (error.message.includes('passkey') || error.message.includes('shortCode')) {
    console.log('🔧 TIP: Check your Passkey and Shortcode in .env')
  } else if (error.message.includes('connection') || error.message.includes('ECONNREFUSED')) {
    console.log('🔧 TIP: Check your internet connection')
  }
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')