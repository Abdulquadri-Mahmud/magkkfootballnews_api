import express from 'express';
import { AdminLogin, AdminSignup, 
    forgotPassword, resetPassword 
} from '../controller/admin_controller.js';
 
const app = express();

app.post('/admin-signup', AdminSignup);
app.post('/admin-login', AdminLogin);
app.post('/forgot-password', forgotPassword);
app.post('/reset-password/:token', resetPassword);

export default app;