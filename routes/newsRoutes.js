import express from "express";
import { allNews, createNews, deleteNews, 
    searchNews, singleNews, updateNews 
} from "../controller/newsController.js";

const app = express();

app.post('/create_product', createNews)
app.get('/all_products', allNews);
app.get('/single_products/:id', singleNews);
app.patch('/update_products/:id', updateNews);
app.delete('/delete_products/:id', deleteNews );
app.get('/search_products/', searchNews);

export default app;