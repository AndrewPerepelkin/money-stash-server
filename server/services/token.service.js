const jwt = require('jsonwebtoken');
// const config = require('config');
require('dotenv').config();
const Token = require('../models/Token');

class TokenService {
  // return accessToken, refreshToken, expiresIn
  generate(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: '1h'
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET);
    return {
      accessToken,
      refreshToken,
      expiresIn: 3600
    };
  }

  async save(user, refreshToken) {
    const data = await Token.findOne({user});

    if (data) {
      data.refreshToken = refreshToken;
      return data.save();
    }

    const token = await Token.create({user, refreshToken});
    return token;
  }

  validateRefresh(refreshToken) {
    try {
      return jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken) {
    try {
      return await Token.findOne({refreshToken});
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();
