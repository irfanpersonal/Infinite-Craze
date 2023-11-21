require('dotenv').config();
require('express-async-errors');
const adminRouter = require('./routers/admin.js');
const orderRouter = require('./routers/orders.js');
const reviewsRouter = require('./routers/review.js');
const productRouter = require('./routers/product.js');
const userRouter = require('./routers/user.js');
const authRouter = require('./routers/auth.js');
const notFoundMiddleware = require('./middleware/not-found.js');
const errorHandlerMiddleware = require('./middleware/error-handler.js');
const connectDB = require('./database/connect.js');
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const path = require('node:path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(fileUpload());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.json());

app.use(express.static(path.resolve(__dirname, './client/build')));

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/users', userRouter);

app.use('/api/v1/products', productRouter);

app.use('/api/v1/reviews', reviewsRouter);

app.use('/api/v1/orders', orderRouter);

app.use('/api/v1/admin', adminRouter);

app.get('*', (req, res) => {
	return res.status(200).sendFile(path.resolve(__dirname, './client/build/index.html'));
});

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`);
        });
    }
    catch(error) {
        console.log(error);
    }
}
start();