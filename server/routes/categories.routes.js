const express = require('express');
const auth = require('../middleware/auth.middleware');
const Category = require('../models/Category');
const User = require('../models/User');
const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(auth, async (req, res) => {
    try {
      const currentUser = await User.findById(req.user._id);
      const list = await Category.find({_id: currentUser.categories});
      res.status(200).send(list);
    } catch (error) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже...'
      });
    }
  })
  .post(auth, async (req, res) => {
    try {
      const newCategory = await Category.create({
        ...req.body,
        custom: true,
        userId: req.user._id
      });

      await User.findByIdAndUpdate(
        req.user._id,
        {$push: {categories: newCategory._id}},
        {new: true}
      );
      const currentUser = await User.findById(req.user._id);
      const list = await Category.find({_id: currentUser.categories});
      res.status(201).send(list); //????
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже...'
      });
    }
  });

router
  .route('/:categoryId')
  .patch(auth, async (req, res) => {
    try {
      const {categoryId} = req.params;
      const currentCategory = await Category.findById(categoryId);
      if (currentCategory.userId === req.user._id) {
        const updatedCategory = await Category.findByIdAndUpdate(
          categoryId,
          req.body,
          {
            new: true
          }
        );

        // const list = await Category.find({_id: currentUser.categories});
        res.status(201).send(updatedCategory);
      } else {
        res.status(401).json({message: 'Unauthorized'});
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже...'
      });
    }
  })
  .delete(auth, async (req, res) => {
    try {
      const {categoryId} = req.params;
      const removedCategory = await Category.findById(categoryId);

      await User.findByIdAndUpdate(
        req.user._id,
        {$pull: {categories: removedCategory._id}},
        {new: true}
      );

      if (
        removedCategory.custom &&
        removedCategory.userId.toString() === req.user._id
      ) {
        await removedCategory.remove();
      }
      const currentUser = await User.findById(req.user._id);

      const list = await Category.find({_id: currentUser.categories});
      res.status(200).send(list);
    } catch (error) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже...'
      });
    }
  });

module.exports = router;
