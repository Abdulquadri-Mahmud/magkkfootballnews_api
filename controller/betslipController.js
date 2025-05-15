import mongoose from "mongoose";
import Betslip from "../model/betslipModel.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createBetslip = async (req, res, next) => {
    const {betslipCode, category, date} = req.body;

    try {
        const betslip = new Betslip({
            betslipCode, category, date
        });

        await betslip.save();

        res.status(201).json('Betslip create successfully!');

    } catch (error) {
        next(error);
    }
}

export const allBetslips = async (req, res, next) => {
    try {
        const allBetslip = await Betslip.find({}).sort({createdAt: - 1});

        res.status(200).json(allBetslip);

    } catch (error) {
        next(error)
    }
}
export const singleBetslip = async (req, res, next) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(errorHandler(404, 'Betslip Not Found!'));
        }

        const getBetslip = await Betslip.findOne({_id : id});

        if (!getBetslip) {
            return next(errorHandler(404, 'Betslip Not Found!'));
        }

        res.status(200).json(getBetslip);

    } catch (error) {
        next(error);
    }
}

export const deleteBetslip = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(errorHandler(404, 'Betslip Not Found!'));
        }

        const getBetslipAndDelete = await Betslip.findByIdAndDelete({ _id : id});

        if (!getBetslipAndDelete) {
            return next(errorHandler(404, 'Betslip Not Found!'));
        }
        
        res.status(200).json('Betslip has been deleted successdully!');
    } catch (error) {
        next(error)
    }
}

export const deleteBetslipWithBodyId = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(errorHandler(404, 'Betslip Not Found!'));
        }

        const getBetslipAndDelete = await Betslip.findByIdAndDelete({ _id : id});

        if (!getBetslipAndDelete) {
            return next(errorHandler(404, 'Betslip Not Found!'));
        }
        
        res.status(200).json('Betslip has been deleted successdully!');
    } catch (error) {
        next(error)
    }
}

export const updateBetslip = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(errorHandler(404, 'Betslip Not Found!'));
        }

        const getBetslipsAndDelete = await Betslip.findByIdAndUpdate({ _id : id}, {...req.body});

        if (!getBetslipsAndDelete) {
            return next(errorHandler(404, 'Betslip Not Found!'));
        }
        
        res.status(200).json('Betslip has been updated successdully!');
    } catch (error) {
        next(error)
    }
}