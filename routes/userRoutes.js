import express  from 'express';
import { allUsers, deleteAccount,signin, signOut, signup,
    singleUser,
    updateUser, userForgotPassword, userResetPassword 
} from '../controller/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const app = express();

app.post('/signup', signup);
app.post('/signin', signin);
app.get('/signout', signOut);
app.patch('/update_user/:id', updateUser);
app.delete('/delete_user/:id', deleteAccount);
app.get('/all-user', allUsers);
app.get('/single_user/:id', singleUser);
app.post('/forgot-password', userForgotPassword);
app.post('/reset-password/:token', userResetPassword);

export default app;6