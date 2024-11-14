import express from 'express';
import { allProducts, createProducts, 
    deleteProduct, searchProduct, singleProducts, updateProduct 
} from '../controller/product_controller.js';

const app = express();

app.post('/create_products', createProducts);
app.get('/all_products', allProducts);
app.get('/single_products/:id', singleProducts);
app.patch('/update_products/:id', updateProduct);
app.delete('/delete_products/:id', deleteProduct);
app.get('/search_products/', searchProduct);

export default app;