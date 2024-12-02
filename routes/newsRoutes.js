import express from "express";
import { allNews, createNews, deleteNews, 
    searchNews, singleNews, updateNews 
} from "../controller/newsController.js";

const app = express();

app.post('/create_news', createNews)
app.get('/all_news', allNews);
app.get('/single_news/:id', singleNews);
app.patch('/update_news/:id', updateNews);
app.delete('/delete_news/:id', deleteNews );
app.get('/search_news/', searchNews);

export default app;