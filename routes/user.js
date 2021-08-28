import express from 'express'
import { requireSignIn, userMiddleware } from '../commonMiddleWare/auth.js';
import { register, loginControler, information, addToCart } from '../controllers/user.js';

const router = express.Router()


router.post('/user/register', register)
// router.get('/user/refresh_token', refreshTokenController)
router.post('/user/login', loginControler)
// router.get('/user/logout', logoutCtrl)
router.patch('/user/addtocart', requireSignIn, userMiddleware, addToCart)
router.post('/infor', requireSignIn, information)
export default router;