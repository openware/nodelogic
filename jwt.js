const jwt = require("jsonwebtoken");
const config = require('./config/config.js');
const fs = require('fs')
const decoded_key = Buffer.from(global.gConfig.jwt.private_key.trim(), 'base64').toString('utf-8')

module.exports = {
  /**
   * sign - create a jwt from payload.
   *
   * @param {Object} payload  the payload send to the user
   * @param {Function} callback function envoked with two parameters
   *                        1. error the error in operation
   * n   2. token the signed payload
   */
  sign (payload, callback) {
    token = jwt.sign(
      { data: payload, exp: Date.now() + global.gConfig.jwt.expire_date },
      decoded_key,
      { algorithm: global.gConfig.jwt.algorithm }
    )
    return token
  },

  /**
   * verify - check the token signature.
   *
   * @param {String} token    the token for verification
   * @param {Function} callback function envoked on completion of the task with
   *                        1. error the error in verification
   *                        2. if verification is successfull the decoded data is passed.
   */
  verify(token, callback) {
      result = jwt.verify(token, decoded_key)
      return result
  },

   /**
   * formatParams - format request parameters.
   *
   * @param {Oblect} payload    payload to format
   */

  formatParams(payload) {
    request_params = {
      payload: payload.split('.')[1],
      signatures: [{
      protected: payload.split('.')[0],
      header: { kid: 'applogic' },
      signature: payload.split('.')[2]
      }]
    }
    return request_params
  }

};
