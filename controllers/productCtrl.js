import productSchema from '../modules/productModal.js'

//filtering,sorting,pagination....
class APIfeature {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }
    filtering() {
        const queryObj = { ...this.queryString }
        const excludedField = ['page', 'sort', 'limit']
        excludedField.forEach(el => delete (queryObj[el]))
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => `$` + match)
        this.query.find(JSON.parse(queryStr))
        return this
    }
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort
            this.query = this.query.sort(sortBy)
        }
        else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 6
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}
export const productCtrl = {
    getProducts: async (req, res) => {
        try {
            const features = new APIfeature(productSchema.find({}), req.query)
                .filtering()
                .sorting()
                .paginating()
            const products = await features.query
            let pages = 0
            if (req.query.page && req.query.limit) {
                const total = await productSchema.countDocuments()
                pages = Math.ceil(total / req.query.limit)
            }
            if (!products) return res.status(400).json({ msg: 'no product found!' })
            if (products) return res.status(200).json({
                pages,
                status: 'success',
                result: products.length,
                products: products,
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createProducts: async (req, res) => {
        try {
            const {
                product_id,
                title,
                price,
                description,
                content,
                images,
                catagory
            } = req.body;
            if (!images) return res.status(400).json({ msg: 'no image uploaded!' })
            const newProduct = new productSchema({
                product_id,
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                catagory
            })
            newProduct.save((error, created) => {
                if (error) {
                    if (error.name === 'MongoError' && error.code === 11000) {
                        const errors = Object.keys(error.keyValue)
                        return res.status(400).json({ msg: `${errors[0]} already exists!!!` })
                    }
                }
                if (created) {
                    return res.status(200).json({ msg: 'product created!' })
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteProducts: async (req, res) => {
        try {
            await productSchema.findOneAndDelete({ _id: req.params.id })
            return res.status(200).json({ msg: "product deleted!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateProducts: async (req, res) => {
        try {
            const {
                title,
                price,
                description,
                content,
                images,
                catagory
            } = req.body
            if (!images) return res.status(400).json({ msg: 'no image uploaded' })
            await productSchema.findOneAndUpdate({ _id: req.params.id }, {
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                catagory
            })
            return res.status(200).json({ msg: 'product updated!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getProductById: async (req, res) => {
        try {
            const product = await productSchema.findOne({ _id: req.params.id })
            if (!product) return res.status(400).json({ msg: 'no product found' })
            if (product) return res.status(200).json({ product: product })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}