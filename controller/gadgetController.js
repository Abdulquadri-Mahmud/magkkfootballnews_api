import Gadgets from "../model/gadgetModel.js";

export const createGadget = async (req, res, next) => {
      const { title,category, date,
          image, description } = req.body;
  
      try {
          const News = new Gadgets({
              title, category, date, image,
              description
          });
  
          await News.save();
  
          res.status(201).json({
              message: 'News create successfully!',
              News
          });
  
      } catch (error) {
          next(error);
      }
  }