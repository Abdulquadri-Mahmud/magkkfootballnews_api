import express from 'express';
import { AdminLogin, adminSignup, allAdmin, deleteAccount,
    forgotPassword, resetPassword, 
} from '../controller/adminController.js';

const app = express();

app.post('/admin-signup', adminSignup);
app.post('/admin-login', AdminLogin);
app.get('/all-admin', allAdmin);
app.delete('/delete-admin/:id', deleteAccount);

app.post('/forgot-password', forgotPassword);
app.post('/reset-password/:token', resetPassword);

export default app;