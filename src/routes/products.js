import express from 'express'
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// Public routes
router.get('/', getAllProducts)
router.get('/:id', getProductById)

// Admin routes (we'll add authentication later)
router.post('/', upload.array('images', 5), createProduct) // Max 5 images
router.put('/:id', upload.array('images', 5), updateProduct)
router.delete('/:id', deleteProduct)

export default router