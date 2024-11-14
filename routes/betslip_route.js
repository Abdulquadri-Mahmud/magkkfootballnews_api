import express from 'express';
import { allBetslip, createBetslip,
    deleteBetslip,
    searchBetslip,
    singleBetslip, updateBetslip 
} from '../controller/betslip_controller.js';

const app = express();

app.post('/create_betslip', createBetslip);
app.get('/all_betslip', allBetslip);
app.get('/single_betslip/:id', singleBetslip);
app.patch('/update_betslip/:id', updateBetslip);
app.delete('/delete_betslip/:id', deleteBetslip);
app.get('/search_betslip/', searchBetslip);


export default app;