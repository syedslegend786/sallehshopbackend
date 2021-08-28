import express from 'express'
import { adminMiddleware, requireSignIn } from '../commonMiddleWare/auth.js'
import { catagoryCtrl } from '../controllers/catagoryCtrl.js'

const router = express.Router()

router.route('/catagory')
    .get(catagoryCtrl.getCatagory)
    .post(requireSignIn, adminMiddleware, catagoryCtrl.createCatagory)
router.route('/catagory/:id')
    .delete(requireSignIn, adminMiddleware, catagoryCtrl.deleteCatagory)
    .put(requireSignIn, adminMiddleware, catagoryCtrl.updateCatagory)
export default router