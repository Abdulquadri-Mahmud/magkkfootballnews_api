import express from 'express';
import { AdminLogin, adminSignup, forgotPassword, resetPassword, 
} from '../controller/adminController';

const app = express();

app.post('/admin-signup', adminSignup);
app.post('/admin-login', AdminLogin);

app.post('/forgot-password', forgotPassword);
app.post('/reset-password/:token', resetPassword);

export default app;