import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
//imported routes...
import userRoutes from './routes/user.js'
import catagoryRoutes from './routes/catagoryRouter.js'
import uploadRoutes from './routes/upload.js'
import productRoutes from './routes/productRouter.js'
import paymentRoutes from './routes/paymentRouter.js'
//
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//
const app = express();
app.use(express.json())
app.use(cors())
dotenv.config()
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
}))
//db config.
const connectionUrl = process.env.DB_URL
mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}
).then(() => {
    console.log('db is connected and working fine')
})

//routes 
app.get('/', (req, res) => {
    res.status(200).json({
        msg: 'Home'
    })
})
app.use('/api', userRoutes)
app.use('/api', catagoryRoutes)
app.use('/api', uploadRoutes)
app.use('/api', productRoutes)
app.use('/api', paymentRoutes)

const PORT = process.env.PORT || 3001
//listener
app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`)
})