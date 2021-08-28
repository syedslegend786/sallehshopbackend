import userSchema from '../modules/userModal.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userSchema.findOne({ email: email })
        if (user) {
            return res.status(400).json({
                msg: 'user already exists',
            })
        } else {
            if (password.length < 6) {
                return res.status(400).json({
                    msg: 'password length atleast be 6...',
                })
            } else {
                const hash_password = await bcrypt.hashSync(password, 10)
                const obj = {
                    name, email, password: hash_password
                }
                if (req.body.role) {
                    obj.role = req.body.role;
                }
                const newUser = new userSchema({
                    ...obj,
                })
                await newUser.save()
                // const accessToken = createAccessToken({ id: newUser._id })
                // const refereshToken = createRefreshToken({ id: newUser._id })

                // res.cookie('refreshToken', refereshToken, {
                //     httpOnly: true,
                //     path: '/api/user/refresh_token',
                //     maxAge: 7 * 24 * 60 * 1000
                // })
                return res.status(200).json({ msg: 'User Created Successfully!' })
            }

        }
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}
// export const refreshTokenController = (req, res) => {

//     try {
//         const refresh_token = req.cookies.refreshToken
//         if (!refresh_token) {
//             return res.status(400).json({ msg: 'please login or register!' })
//         } else {
//             jwt.verify(refresh_token, process.env.REFRESH_TOKEN, (error, user) => {
//                 if (error) return res.status(400).json({ msg: 'please login or register!' })
//                 const accessToken = createAccessToken({ id: user.id })
//                 return res.status(200).json({ accessToken, user })
//             })
//         }
//     } catch (err) {
//         return res.status(500).json({ msg: err.message })
//     }
// }

// {
// 	"email": "user1@gmail.com",
// 	"password": "123456"
// }
export const loginControler = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userSchema.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                msg: 'no user found!'
            })
        }
        if (user) {
            const isMatchPassword = await bcrypt.compareSync(password, user.password)
            if (isMatchPassword) {
                // const accessToken = createAccessToken({ id: user._id })
                // const refereshToken = createRefreshToken({ id: user._id })
                // res.cookie('refreshToken', refereshToken, {
                //     httpOnly: true,
                //     path: '/api/user/refresh_token',
                //     maxAge: 7 * 24 * 60 * 1000
                // })
                const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: '11m' })
                return res.status(200).json({
                    token
                })
            } else {
                return res.status(400).json({
                    msg: 'incorrect password!'
                })
            }
        }
    } catch (err) {
        return res.status(500).json({
            msg: err.message
        })
    }
}

export const information = async (req, res) => {
    try {
        const user = await userSchema.findById({ _id: req.user.id }).select("-password")
        if (!user) return res.status(400).json({ msg: 'user does not exist' })
        if (user) {
            return res.status(200).json({ user })
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }

}


export const addToCart = async (req, res) => {
    try {
        const user = await userSchema.findById({ _id: req.user.id })
        if (!user) return res.status(400).json({ msg: 'No user found!' })
        if (user) {
            await userSchema.findOneAndUpdate({ _id: req.user.id }, {
                cart: req.body.cart
            })
        }
        return res.status(200).json({ msg: 'cart updated...' })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}
// export const logoutCtrl = (req, res) => {
//     res.clearCookie('refreshToken', { path: '/api/user/refresh_token' })
//     return res.status(200).json({ msg: 'Logout Successfully!' })
// }

// const createAccessToken = (user) => {
//     return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '11m' })
// }
// const createRefreshToken = (user) => {
//     return jwt.sign(user, process.env.REFRESH_TOKEN, { expiresIn: '7d' })
// }
// ACCESS_TOKEN
// REFRESH_TOKEN