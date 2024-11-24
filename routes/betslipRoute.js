import express from 'express';
import { allBetslips, createBetslip, deleteBetslip,
    singleBetslip, updateBetslip 
} from '../controller/betslipController.js';

const app = express();

app.post('/create_betslip', createBetslip)
app.get('/all_betslip', allBetslips);
app.get('/single_betslip/:id', singleBetslip);
app.patch('/update_betslip/:id', updateBetslip);
app.delete('/delete_betslip/:id', deleteBetslip);

export default app;