const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {generateUserImage} = require('../utils/helpers');
const tokenService = require('../services/token.service');
const {check, validationResult} = require('express-validator');
const Category = require('../models/Category');

const router = express.Router({mergeParams: true});

// /api/auth/singUp
// 1. get data from request {email, password...}
// 2. check if user already exists
// 3. hash password
// 4. create new user
// 5. generate and send tokens
router.post('/singUp', [
  check('email', 'Некорректный Email').isEmail(),
  check('password', 'Минимальная длинна пароля 8 символов').isLength({min: 8}),
  async (req, res) => {
    try {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.status(400).json({
          validationErrors: validationErrors.array(),
          error: {
            message: 'INVALID_DATA',
            code: 400
          }
        });
      }

      const {email, password} = req.body;

      const existingUser = await User.findOne({email});

      if (existingUser) {
        return res.status(400).json({
          error: {
            message: 'EMAIL_EXISTS',
            code: 400
          }
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const initCategories = await Category.find({custom: false})

      const newUser = await User.create({
        ...generateUserImage(),
        ...req.body,
        password: hashedPassword,
        categories: initCategories
      });

      const tokens = tokenService.generate({_id: newUser._id});
      await tokenService.save(newUser._id, tokens.refreshToken);

      res.status(201).send({...tokens, userId: newUser._id});
    } catch (error) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже...'
      });
    }
  }
]);

// 1. validate
// 2. find user
// 3. compare hashed passwords
// 4. generate tokens
// 5. return data
router.post('/signInWithPassword', [
  check('email', 'Некорректный Email').normalizeEmail().isEmail(),
  check('password', 'пароль не может быть пустым').exists(),
  async (req, res) => {
    try {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.status(400).json({
          validationErrors: validationErrors.array(),
          error: {
            message: 'INVALID_DATA',
            code: 400
          }
        });
      }

      const {email, password} = req.body;

      const existingUser = await User.findOne({email});

      if (!existingUser) {
        return res.status(400).json({
          error: {
            message: 'EMAIL_NOT_FOUND',
            code: 400
          }
        });
      }

      const isPasswordEqual = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordEqual) {
        return res.status(400).json({
          error: {
            message: 'INVALID_PASSWORD',
            code: 400
          }
        });
      }

      const tokens = tokenService.generate({_id: existingUser._id});
      await tokenService.save(existingUser._id, tokens.refreshToken);

      res.status(200).send({...tokens, userId: existingUser._id});
    } catch (error) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже...'
      });
    }
  }
]);

function isTokenValid(data, dbToken) {
  return !data || !dbToken || data._id !== dbToken?.user?.toString();
}

router.post('/token', async (req, res) => {
  try {
    const {refreshToken} = req.body;
    const data = tokenService.validateRefresh(refreshToken);
    const dbToken = await tokenService.findToken(refreshToken);
    if (isTokenValid(data, dbToken)) {
      return res.status(401).json({message: 'Unauthorized'});
    }

    const tokens = tokenService.generate({_id: data._id});
    await tokenService.save(data._id, tokens.refreshToken);
    res.status(200).send({...tokens, userId: data._id});
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже...'
    });
  }
});

module.exports = router;
