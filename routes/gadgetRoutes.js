import express from "express";
import { createGadget } from "../controller/gadgetController.js";

const app = express();

app.post('/create-gadget', createGadget)

export default app;