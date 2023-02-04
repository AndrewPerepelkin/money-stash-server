const express = require('express');
const auth = require('../middleware/auth.middleware');
const Account = require('../models/Account');
const User = require('../models/User');
const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(auth, async (req, res) => {
    try {
      const currentUser = await User.findById(req.user._id);
      const list = await Account.find({_id: currentUser.accounts});
      res.status(200).send(list);
    } catch (error) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже...'
      });
    }
  })
  .post(auth, async (req, res) => {
    try {
      const newAccount = await Account.create({
        ...req.body,
        userId: req.user._id
      });

      await User.findByIdAndUpdate(
        req.user._id,
        {$push: {accounts: newAccount._id}},
        {new: true}
      );
      const currentUser = await User.findById(req.user._id);
      const list = await Account.find({_id: currentUser.accounts});
      res.status(201).send(list); //????
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже...'
      });
    }
  });

router
  .route('/:accountId')
  .patch(auth, async (req, res) => {
    try {
      const {accountId} = req.params;
      const currentAccount = await Account.findById(accountId);
      if (currentAccount.userId === req.user._id) {
        const updatedAccount = await Account.findByIdAndUpdate(
          accountId,
          req.body,
          {
            new: true
          }
        );

        // const list = await Account.find({_id: currentUser.accounts});
        res.status(201).send(updatedAccount);
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
      const {accountId} = req.params;
      const removedAccount = await Account.findById(accountId);

      if (removedAccount.userId.toString() === req.user._id) {
        await User.findByIdAndUpdate(
          req.user._id,
          {$pull: {categories: removedAccount._id}},
          {new: true}
        );
        await removedAccount.remove();
      }

      const currentUser = await User.findById(req.user._id);
      const list = await Account.find({_id: currentUser.accounts});
      res.status(200).send(list);
    } catch (error) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже...'
      });
    }
  });

module.exports = router;
