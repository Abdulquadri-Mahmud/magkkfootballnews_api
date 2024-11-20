import express from "express";
import { allProducts, createGadget, deleteProduct,
      searchProduct, singleProducts, updateProduct
} from "../controller/gadgetController.js";

const app = express();

app.post('/create-gadget', createGadget)
app.get('/all_products', allProducts);
app.get('/single_products/:id', singleProducts);
app.patch('/update_products/:id', updateProduct);
app.delete('/delete_products/:id', deleteProduct);
app.get('/search_products/', searchProduct);

export default app;