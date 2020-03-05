// const express = require('express');
// const router = express.Router();
// const gravatar = require('gravatar');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('config');
// const auth = require('../../middleware/auth');
// const { check, validationResult } = require("express-validator");

// const Category = require('../../models/Category');

// // POST api/category
// // Create a category
// // Private
// router.post(
//     '/',
//     [
//       auth,
//       [
//         check('name', 'Category name is required').not().isEmpty()
//       ]
//     ],
//     async (req, res) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
  
//       try {
//         const newCategory = new Category ({
//             name: req.body.name,
//         });
//         console.log(newCategory)
//         // category.categorys.unshift(newCategory);

//         // await category.save();

//         // res.json(category.name);
//       } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//       }
//     }
//   );

// module.exports = router;
