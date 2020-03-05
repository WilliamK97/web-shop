const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  categorys:[
    {    
      name: {
            type: String
        }
    }
  ]
  
});

module.exports = Category = mongoose.model('category', CategorySchema);
