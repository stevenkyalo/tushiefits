import express from 'express'
import { Mpesa } from 'mpesa-app'
import prisma from '../lib/prisma.js'

const router = express.Router()

// Initialize M-Pesa client
const mpesa = new Mpesa({
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortCode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
})

// ==========================================
// STK Push: Initiate Payment
// ==========================================
router.post('/stk-push', async (req, res) => {
  try {
    const { phoneNumber, amount, accountReference, transactionDesc } = req.body

    // Validate inputs
    if (!phoneNumber || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and amount are required',
      })
    }

    // Format phone number (remove leading 0 or +)
    const formattedPhone = phoneNumber.replace(/^0+/, '').replace(/^\+/, '')

    // Initiate STK Push
    const response = await mpesa.stkPush({
      phone: formattedPhone,
      amount: parseFloat(amount),
      accountReference: accountReference || 'TushieFits',
      transactionDesc: transactionDesc || 'Payment for order',
      callbackUrl: process.env.MPESA_CALLBACK_URL,
    })

    // Store transaction reference in database (optional, for tracking)
    // You could save this in an MpesaTransaction model

    res.json({
      success: true,
      message: 'STK Push sent successfully',
      data: {
        checkoutRequestID: response.CheckoutRequestID,
        merchantRequestID: response.MerchantRequestID,
        responseCode: response.ResponseCode,
        responseDescription: response.ResponseDescription,
      },
    })
  } catch (error) {
    console.error('STK Push error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate payment',
    })
  }
})

// ==========================================
// M-Pesa Callback (Webhook)
// ==========================================
router.post('/callback', (req, res) => {
  try {
    // Parse the callback data using the SDK
    const callbackData = mpesa.parseCallback(req.body)

    console.log('📩 M-Pesa Callback:', callbackData)

    // Check if payment was successful
    if (callbackData.resultCode === 0) {
      console.log('✅ Payment successful!')
      console.log('Transaction ID:', callbackData.transactionId)
      console.log('Amount:', callbackData.amount)
      console.log('Phone:', callbackData.phone)

      // IMPORTANT: Update your order in the database here!
      // For example:
      // await prisma.order.update({
      //   where: { orderNumber: callbackData.accountReference },
      //   data: { paymentStatus: 'PAID' }
      // })

      // You could also store the transaction details
      // await prisma.mpesaTransaction.create({ data: { ... } })

    } else {
      console.log('❌ Payment failed:', callbackData.resultDesc)
    }

    // Always respond with 200 OK to M-Pesa
    res.sendStatus(200)
  } catch (error) {
    console.error('Callback error:', error)
    res.sendStatus(400)
  }
})

// ==========================================
// Query STK Push Status
// ==========================================
router.post('/stk-query', async (req, res) => {
  try {
    const { checkoutRequestID } = req.body

    if (!checkoutRequestID) {
      return res.status(400).json({
        success: false,
        message: 'CheckoutRequestID is required',
      })
    }

    const status = await mpesa.stkQuery({
      checkoutRequestId: checkoutRequestID,
    })

    res.json({
      success: true,
      data: status,
    })
  } catch (error) {
    console.error('STK Query error:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

export default router