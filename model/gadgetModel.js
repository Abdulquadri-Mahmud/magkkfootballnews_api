import mongoose from "mongoose";

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
}, {timestamps : true});

const Gadgets = mongoose.model('gadget', gadgetsSchema);

export default Gadgets;