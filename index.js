import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userAuthentication from './routes/user_auth.js';
import productsRoutes from './routes/products_route.js'
import betslipRoutes from './routes/betslip_route.js'
import newsRoutes from './routes/news_routes.js'
import adminAuthentication from './routes/admin_auth_routes.js'

dotenv.config()

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "https://adexify-online-shopping-site.vercel.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    next();
});

// https://adexify-online-shopping-site.vercel.app/ changes made
// http://localhost:5173

mongoose.connect(process.env.db).then((response) => {
    console.log('Database Connected!');
    app.listen(process.env.PORT, () => {
        console.log('Server is listening on port 3000!');
    });
}).catch((error) => {
    console.log(error);
});

app.get("/",(req, res,) => {
    res.send('Hello World');
});

app.use('/api/products', productsRoutes);
app.use('/api/user/auth', userAuthentication);
app.use('/api/betslip', betslipRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admin/auth', adminAuthentication);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error!';

    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    });
});
