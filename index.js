import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(cookieParser);

app.get("/", (req, res) => res.send("Express on Vercel"));
mongoose.connect(process.env.db).then((response) => {
    console.log('Database connected!');
    app.listen(process.env.PORT, () => console.log("Server ready on port 3000."));
}).catch((error) => {
    console.log(error);
    
});

app.get((req, res) => {
    res.send('Heloo World!');
});

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