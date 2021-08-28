import express from 'express'
import { adminMiddleware, requireSignIn, userMiddleware } from '../commonMiddleWare/auth.js'
import { paymentCtrl } from '../controllers/paymentCtrl.js';
const router = express.Router()

router.post('/user/createpayment', requireSignIn, userMiddleware, paymentCtrl.createPayment)
router.get('/user/getpayments', requireSignIn, userMiddleware, paymentCtrl.getPayment)
router.get('/admin/getpayments', requireSignIn, adminMiddleware, paymentCtrl.getAllPayments)

export default router;