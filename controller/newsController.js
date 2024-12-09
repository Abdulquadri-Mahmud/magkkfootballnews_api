import mongoose from "mongoose";
import { errorHandler } from "../utils/errorHandler.js";
import News from "../model/newsModel.js";

export const createNews = async (req, res, next) => {
    const { title, date, source, description } = req.body;
  
    // Validate incoming data
    if (!title || !date || !source || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      // Create a new News object
      const addNews = new News({
        title, 
        source, 
        date, 
        description
      });
  
      // Save the new News object to the database
      await addNews.save();
  
      // Return success response
      res.status(201).json({
        message: 'News created successfully!',
        news: addNews // It's a good idea to rename this as 'news' instead of 'addNews' for clarity
      });
      
    } catch (error) {
      // Pass the error to the error-handling middleware
      next(error);
    }
};

  export const allNews = async (req, res, next) => {
    try {
        const getNews = await News.find({}).sort({createdAt: -1});

        res.status(200).json(getNews);

    } catch (error) {
        next(error)
    }
}

export const singleNews = async (req, res, next) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(errorHandler(404, 'News Not Found!'));
        }

        const getNews = await News.findOne({_id : id});

        if (!getNews) {
            return next(errorHandler(404, 'News Not Found!'));
        }

        res.status(200).json(getNews);
    } catch (error) {
        next(error);
    }
}

export const deleteNews = async (req, res, next) => {
    
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(errorHandler(404, 'News Not Found!'));
        }

        const getNewsAndDelete = await News.findByIdAndDelete({ _id : id});

        if (!getNewsAndDelete) {
            return next(errorHandler(404, 'News Not Found!'));
        }
        
        res.status(200).json('News has been deleted successdully!');
    } catch (error) {
        next(error)
    }
}

export const updateNews = async (req, res, next) => {
    
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(errorHandler(404, 'News Not Found!'));
        }

        const getNewsAndDelete = await News.findByIdAndUpdate({ _id : id}, {...req.body});

        if (!getNewsAndDelete) {
            return next(errorHandler(404, 'News Not Found!'));
        }
        
        res.status(200).json('News has been updated successdully!');
    } catch (error) {
        next(error)
    }
}

export const searchNews = async (req, res, next) => {
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
        const getNews = await News.find({
            name: { $regex: searchTerm, $options: 'i'},
            price: { $regex: price, $options: 'i'},
            category: { $regex: category, $options: 'i'},
            gender: { $regex: gender, $options: 'i'},
        }).sort({
            [sort]: order
        }).limit(limit).skip(startIndex);

        return res.status(200).json(getNews);

    } catch (error) {
        next(error)
    }
}
