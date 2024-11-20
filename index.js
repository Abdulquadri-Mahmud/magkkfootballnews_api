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

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

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