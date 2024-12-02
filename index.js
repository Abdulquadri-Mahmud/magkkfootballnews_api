import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// routes
import userAuthentications from './routes/userRoutes.js';
import adminAuth from './routes/adminRoutes.js';
import gadget from './routes/gadgetRoutes.js';
import news from './routes/newsRoutes.js';
import betslip from './routes/betslipRoute.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "https://magkfootball.vercel.app");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Origin", "http://localhost:5174");
    next();
});


mongoose.connect(process.env.db).then((response) => {
    console.log('Database Connected!');
    app.listen(process.env.PORT, () => {
        console.log('Server is listening on port 3000!');
    });
}).catch((error) => {
    console.log(error);
});

app.get("/", (req, res) => {
    res.send('Heloo World!');
});

app.use('/api/user/auth', userAuthentications);
app.use('/api/admin/auth', adminAuth);
app.use('/api/gadget', gadget);
app.use('/api/news', news);
app.use('/api/betslip', betslip);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error!';

    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    });
});

export default app;