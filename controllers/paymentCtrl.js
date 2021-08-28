import userSchema from '../modules/userModal.js'
import paymentSchema from '../modules/paymentModal.js'
import productSchema from '../modules/productModal.js'

export const paymentCtrl = {
    getPayment: async (req, res) => {
        try {
            const payments = await paymentSchema.find({ user_id: req.user.id })
            if (!payments) return res.status(400).json({ msg: 'no payments found!' })

            return res.status(200).json({ payments: payments })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createPayment: async (req, res) => {
        try {
            const {
                paymentId,
                address,
                cart,
            } = req.body
            const user = await userSchema.findById({ _id: req.user.id })
            if (!user) return res.status(400).json({ msg: 'user not exists' })
            const { name, email, _id } = user
            const newPayment = new paymentSchema({
                name,
                email,
                user_id: _id,
                paymentId,
                address,
                cart,
            })
            cart.forEach(async (val) => {
                await productSchema.findOneAndUpdate({ _id: val._id }, {
                    sold: val.sold + val.quantity,
                })
            })
            await newPayment.save()
            // return res.status(200).json({
            //     newPayment
            // })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllPayments: async (req, res) => {
        try {
            const payments = await paymentSchema.find({})
            if (!payments) return res.status(400).json({ msg: 'no payments found!' })
            return res.status(200).json({ payments })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}