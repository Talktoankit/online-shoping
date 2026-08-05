const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please add a product name'],
    trim: true 
  },
  price: { 
    type: Number, 
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  description: { 
    type: String, 
    required: [true, 'Please add a description']
  },
  image: { 
    type: String, 
    required: [true, 'Please add an image']
  },
  public_id: { 
    type: String,  // Stores the filename
    required: true
  },
  stock: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);