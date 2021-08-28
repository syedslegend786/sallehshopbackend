import catagorySchema from './../modules/catagoryModal.js'
import productsSchema from './../modules/productModal.js'

export const catagoryCtrl = {
    getCatagory: async (req, res) => {
        try {
            const catagories = await catagorySchema.find({})
            if (!catagories) return res.status(400).json({ erro: 'no catagories found' })
            return res.status(200).json({ catagories })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    // {
    //     "name": "catagory 01"
    // }
    createCatagory: async (req, res) => {
        try {
            const { name } = req.body
            const catagory = await catagorySchema.findOne({ name })
            if (catagory) return res.status(400).json({ msg: 'catagory already defined!' })
            const newCatagory = new catagorySchema({
                name
            })
            await newCatagory.save()
            return res.status(200).json({ msg: 'catagory created!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },
    deleteCatagory: async (req, res) => {
        try {
            const catagoryName = await catagorySchema.findOne({ _id: req.params.id }).select("name")
            const products = await productsSchema.findOne({ catagory: catagoryName.name })
            if (products) {
                return res.status(400).json({ msg: 'Please Delete All Products Related to Catagory.' })
            }
            else {
                await catagorySchema.findOneAndDelete({ _id: req.params.id })
                return res.status(200).json({ msg: 'catagory deleted!' })
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateCatagory: async (req, res) => {
        try {
            const { name } = req.body;
            await catagorySchema.findOneAndUpdate({ _id: req.params.id }, { name })
            return res.status(200).json({ msg: 'catagory updated!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}