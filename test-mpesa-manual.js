import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const baseURL = 'https://sandbox.safaricom.co.ke'

console.log('🔍 Manual M-Pesa API Test...')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

async function testMpesa() {
  try {
    // Step 1: Get Access Token
    console.log('📋 Getting access token...')
    
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64')

    const tokenResponse = await axios.get(
      `${baseURL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )

    const accessToken = tokenResponse.data.access_token
    console.log('✅ Access token obtained')

    // Step 2: Format timestamp (YYYYMMDDHHmmss)
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, '')
      .slice(0, 14)

    // Step 3: Generate password
    const password = Buffer.from(
      `174379${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64')

    console.log('📱 Sending STK Push...')
    console.log('   Phone: 254708374149')
    console.log('   Amount: 1')

    // Step 4: Send STK Push
    const stkResponse = await axios.post(
      `${baseURL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: '174379',
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: 1,
        PartyA: '254708374149',
        PartyB: '174379',
        PhoneNumber: '254708374149',
        CallBackURL: 'https://webhook.site/',
        AccountReference: 'TEST-001',
        TransactionDesc: 'Test Payment',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('✅ Response:', JSON.stringify(stkResponse.data, null, 2))

    if (stkResponse.data.ResponseCode === '0') {
      console.log('✅ SUCCESS! STK Push sent to phone!')
    } else {
      console.log(`❌ Failed: ${stkResponse.data.ResponseDescription}`)
    }
  } catch (error) {
    console.error('❌ Error:')
    if (error.response) {
      console.error(`   Status: ${error.response.status}`)
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`)
    } else {
      console.error(`   Message: ${error.message}`)
    }
  }
}

testMpesa()