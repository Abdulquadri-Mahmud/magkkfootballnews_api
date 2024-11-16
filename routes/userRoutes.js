import express  from 'express';
import { signup } from '../controller/userController.js';

const app = express();

app.post('/signup', signup)

export default app;