const jwt = require("jsonwebtoken");
const config = require('./config/config.js');
const fs = require('fs')
const decoded_key = new Buffer(global.gConfig.jwt.private_key.trim(), 'base64').toString('utf-8')

module.exports = {
  /**
   * sign - create a jwt from payload.
   *
   * @param {Object} payload  the payload send to the user
   * @param {Function} callback function envoked with two parameters
   *                        1. error the error in operation
   *                        2. token the signed payload
   * @returns {Promise}
   */
  sign(payload, callback) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { payload: payload, exp: Date.now() + global.gConfig.jwt.expire_date },
        decoded_key,
        { algorithm: global.gConfig.jwt.algorithm },
        function(errorInSign, token) {
          if (errorInSign) {
            if (callback) {
              callback(errorInSign.message);
              resolve(null);
            } else {
              reject(errorInSign.message);
            }
          } else {
            if (callback) {
              callback(null, token);
              resolve(null);
            } else {
              resolve(token);
            }
          }
        }
      );
    });
  },

  /**
   * verify - check the token signature.
   *
   * @param {String} token    the token for verification
   * @param {Function} callback function envoked on completion of the task with
   *                        1. error the error in verification
   *                        2. if verification is successfull the decoded data is passed.
   * @returns {Promise}
   */
  verify(token, callback) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, decoded_key, function(
        errorInVerfication,
        decodedData
      ) {
        if (errorInVerfication) {
          if (callback) {
            callback(errorInVerfication.message);
            resolve(null);
          } else {
            reject(errorInVerfication.message);
          }
        } else {
          if (callback) {
            callback(null, decodedData);
            resolve(null);
          } else {
            resolve(decodedData);
          }
        }
      });
    });
  }
};
