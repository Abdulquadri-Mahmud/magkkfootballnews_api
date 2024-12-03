import mongoose from "mongoose";

const generateProductId = () => {
      const number = 100000
      return Math.floor(1000 * Math.random() * number).toString().slice(0, 5);
}

var gadgetsSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true
      },
      category: {
            type: String,
            required: true
      },
      price: {
            type: Number,
            required: true
      },
      category: {
            type: String,
            required: true
      },
      date: {
            type: String,
            required: true
      },
      image: {
            type: [],
            required: true
      },
      description: {
            type: String,
            required: true
      },
      productId : {
            type: String,
            unique: true,
            default : generateProductId
        },
}, {timestamps : true});

const Gadgets = mongoose.model('gadget', gadgetsSchema);

export default Gadgets;