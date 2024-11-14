import mongoose from "mongoose";
import { errorHandler } from "../utils/errorHandler.js";
import Betslip from "../model/Betslip_model.js";

export const createBetslip = async (req, res, next) => {
    const { betcode,category, 
        image, description } = req.body;

    try {
        const Betslip = new Betslip({
            betcode,category, image,
            description
        });

        await Betslip.save();

        res.status(201).json({
            message: 'Betslip create successfully!',
            Betslip
        });

    } catch (error) {
        next(error);
    }
}

export const allBetslip = async (req, res, next) => {
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

export const updateBetslip = async (req, res, next) => {
    
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(errorHandler(404, 'Betslip Not Found!'));
        }

        const getBetslipAndDelete = await Betslip.findByIdAndUpdate({ _id : id}, {...req.body});

        if (!getBetslipAndDelete) {
            return next(errorHandler(404, 'Betslip Not Found!'));
        }
        
        res.status(200).json('Betslip has been updated successdully!');
    } catch (error) {
        next(error)
    }
}

export const searchBetslip = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;

        const startIndex = parseInt(req.query.startIndex) || 0;

        const searchTerm = req.query.searchTerm || '';

        const name = req.query.name || '';

        const price = req.query.price || '';

        const category = req.query.category || '';

        let sort = req.query.sort || 'createdAt';

        let order = req.query.order || 'desc';

        // get cars 
        const getBetslip = await Betslip.find({
            name: { $regex: searchTerm, $options: 'i'},
            price: { $regex: price, $options: 'i'},
            category: { $regex: category, $options: 'i'},
            gender: { $regex: gender, $options: 'i'},
        }).sort({
            [sort]: order
        }).limit(limit).skip(startIndex);

        return res.status(200).json(getBetslip);

    } catch (error) {
        next(error)
    }
}