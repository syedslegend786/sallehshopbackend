import express from 'express'
import { productCtrl } from '../controllers/productCtrl.js'

const router = express.Router()

router.route('/product')
    .get(productCtrl.getProducts)
    .post(productCtrl.createProducts)
router.route('/product/:id')
    .delete(productCtrl.deleteProducts)
    .put(productCtrl.updateProducts)
    .get(productCtrl.getProductById)

export default router