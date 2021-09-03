const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            min: 3,
            max: 160,
            required: true
        }, 
      
        purchase_year: {
            type: Number
        },
       
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);