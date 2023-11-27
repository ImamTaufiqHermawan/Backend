const mongoose = require("mongoose");
const BaseSchema = require("./baseSchema");

const categorySchema = new BaseSchema({
  name: {
    type: String,
    required: true,
  },
  imageCategory: {
    type: String,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
