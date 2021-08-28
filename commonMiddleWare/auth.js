import jwt from 'jsonwebtoken'
import userSchema from '../modules/userModal.js'
export const requireSignIn = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) return res.status(400).json({ msg: 'jwt required' })
    jwt.verify(token, process.env.ACCESS_TOKEN, (error, user) => {
        if (error) return res.status(500).json({ msg: 'access denied!' })
        if (user) {
            req.user = user
            next()
        }
    })
}


export const adminMiddleware = async (req, res, next) => {
    try {
        const user = await userSchema.findById({ _id: req.user.id })
        if (user) {
            if (user.role == 0) return res.status(400).json({ msg: 'admin resourcess access denied!' })
            next()
        }
    } catch (err) {
        return res.status(500).json({ msg: 'not working' })
    }

}
export const userMiddleware = async (req, res, next) => {
    try {
        const user = await userSchema.findById({ _id: req.user.id })
        if (user) {
            if (user.role == 1) return res.status(400).json({ msg: 'user resourcess access denied!' })
            next()
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }

}