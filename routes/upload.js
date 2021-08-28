import cloudinary from 'cloudinary'
import express from 'express'
import dotenv from 'dotenv'
import fs from 'fs'
import { adminMiddleware, requireSignIn } from '../commonMiddleWare/auth.js'
dotenv.config()
const router = express.Router()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

//post picture on cloudinary...
router.post('/upload', requireSignIn, adminMiddleware, (req, res) => {
    try {
        if (!req.files || Object.keys(req.files) === 0) {
            return res.status(400).json({ msg: 'no file selected!' })
        }
        const file = req.files.file
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTempFiles(file.tempFilePath)
            return res.status(400).json({ msg: 'incorrect file format!' })
        }
        if (file.size > (1024 * 1024)) {
            removeTempFiles(file.tempFilePath)
            return res.status(400).json({ msg: 'file size is too large!' })
        }
        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: 'vitnamecommerce' }, async (err, result) => {
            if (err) throw err
            removeTempFiles(file.tempFilePath)
            res.json({
                public_id: result.public_id,
                url: result.secure_url,
            })
        })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }

})
//delete picture on cloudinary...
router.post('/destroy', requireSignIn, adminMiddleware,  (req, res) => {
    try {
        const { public_id } = req.body
        if (!public_id) return res.status(400).json({ msg: 'not file selected!' })
        if (public_id) {
            cloudinary.v2.uploader.destroy(public_id, (err, result) => {
                if (err) return res.status(400).json({ msg: err })
                if (result) {
                    return res.status(200).json({
                        msg: 'file deleted!'
                    })
                }
            })
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})
//we must have to deleter every item in temp folder...
const removeTempFiles = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

export default router;