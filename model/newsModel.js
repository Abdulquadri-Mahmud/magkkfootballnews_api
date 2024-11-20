import mongoose from "mongoose";

var newsSchema = new mongoose.Schema({
      title: {
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

const News = mongoose.model('new', newsSchema);

export default News;