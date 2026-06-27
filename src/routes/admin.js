import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Admin dashboard page
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/admin/dashboard.html'))
})

// Admin add product page
router.get('/add-product', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/admin/add-product.html'))
})

// Admin edit product page
router.get('/edit-product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/admin/edit-product.html'))
})

export default router