const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Product = require('../../models/Product')
const User = require('../../models/User');
const Category = require('../../models/Category');

//get all products    done
//get products by id  done
//post product        done
//like product        done
//unlike              done     
//bid on product
//comment on product
//uncomment
//delete a product

// POST api/products
// Create a product
// Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', "description is required").not().isEmpty(),
      check('price', "Price is required").not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newProduct = new Product({
        userName: user.name,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        endDate: req.body.endDate,
        avatar: user.avatar,
        productImage: req.body.productImage
      });

      const product = await newProduct.save();

      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// GET api/products/all
// Get all products
// Private
router.get('/all', auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/products/:id
// Get product by ID
// Private
router.get('/:id',  async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});



// PUT api/products/like/:id
// Like a product
// Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const user = await User.findById(req.user.id).select('name');
    console.log(user.name)

    // Check if the product has already been liked
    if (
      product.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Product already liked' });
    }

    product.likes.unshift({ 
      user: req.user.id,
      name: user.name
    });

    await product.save();

    res.json(product.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT api/product/unlike/:id
// Unlike a product
// Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // Check if the product has already been liked
    if ( product.likes.filter(like => like.user.toString() === req.user.id).length === 0 )
    {
      return res.status(400).json({ msg: 'Product has not yet been liked' });
    }

    // Get remove index
    const removeIndex = product.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

      product.likes.splice(removeIndex, 1);

    await product.save();

    res.json(product.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST api/tweets/comment/:id
// Comment on a tweet
// Private
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const tweet = await Tweet.findById(req.params.id);

      const newTweet = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      tweet.comments.unshift(newTweet);

      await tweet.save();

      res.json(tweet.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// DELETE api/tweets/comment/:id/:comment_id
// Delete comment
// Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    const comment = tweet.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = tweet.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    tweet.comments.splice(removeIndex, 1);

    await tweet.save();

    res.json(tweet.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE api/tweets/:id
// Delete a tweet
// Private
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const tweet = await Tweet.findById(req.params.id);

//     if (!tweet) {
//       return res.status(404).json({ msg: 'Tweet not found' });
//     }

//     // Check user
//     if (tweet.user.toString() !== req.user.id) {
//       return res.status(401).json({ msg: 'User not authorized' });
//     }

//     await tweet.remove();

//     res.json({ msg: 'Tweet removed' });
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Tweet not found' });
//     }
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
