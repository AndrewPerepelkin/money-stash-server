const express = require('express');
const auth = require('../middleware/auth.middleware');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(auth, async (req, res) => {
    try {
      const currentUser = await User.findById(req.user._id);
      const list = await Transaction.find({_id: currentUser.transactions});
      res.status(200).send(list);
    } catch (error) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже...'
      });
    }
  })
  .post(auth, async (req, res) => {
    try {
      const newTransaction = await Transaction.create({
        ...req.body,
        userId: req.user._id
      });

      await User.findByIdAndUpdate(
        req.user._id,
        {$push: {transactions: newTransaction._id}},
        {new: true}
      );
      const currentUser = await User.findById(req.user._id);
      const list = await Transaction.find({_id: currentUser.transactions});
      res.status(201).send(list); //????
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже...'
      });
    }
  });

router
  .route('/:transactionId')
  .patch(auth, async (req, res) => {
    try {
      const {transactionId} = req.params;
      const currentTransaction = await Transaction.findById(transactionId);
      if (currentTransaction.userId === req.user._id) {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          transactionId,
          req.body,
          {
            new: true
          }
        );

        // const list = await Transaction.find({_id: currentUser.transactions});
        res.status(201).send(updatedTransaction);
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
      const {transactionId} = req.params;
      const removedTransaction = await Transaction.findById(transactionId);

      if (removedTransaction.userId.toString() === req.user._id) {
        await User.findByIdAndUpdate(
          req.user._id,
          {$pull: {categories: removedTransaction._id}},
          {new: true}
        );
        await removedTransaction.remove();
      }

      const currentUser = await User.findById(req.user._id);
      const list = await Transaction.find({_id: currentUser.transactions});
      res.status(200).send(list);
    } catch (error) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже...'
      });
    }
  });

module.exports = router;
