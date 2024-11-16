import express  from 'express';
import { signin, signup } from '../controller/userController.js';

const app = express();

app.post('/signup', signup);
app.post('/signin', signin);

export default app;