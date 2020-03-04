const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  userName:{
    type: String
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now,
    //required: true
  },
  endDate: {
    type: Date,
    //required: true
  },
//   category: {
//     type: Schema.Types.ObjectId,
//     ref: 'categories'
//   },
  bids: [
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        price:{
            type: Number,
            required: true
        },
        date: {
          type: Date,
          default: Date.now
        },
        name: {
          type: String
        },
        avatar: {
          type: String
        },

    }
  ],
  avatar: {
    type: String
  },
  productImage: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      name: {
        type: String
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = Product = mongoose.model('product', ProductSchema);
