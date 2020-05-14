"use strict";

const FeatherError = require("../errors/featherError");
const ErrorType = require("../errors/errorType");
const ErrorCode = require("../errors/errorCode");

const publicKeys = {
  _feather: null,
  _cachedPublicKeys: {},

  /**
   * Retrieves a public key
   * @arg id
   * @return publicKey
   */
  retrieve: function(id) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(
          new FeatherError({
            type: ErrorType.VALIDATION,
            code: ErrorCode.PARAMETER_INVALID,
            message: `expected param 'id' to be of type 'string'`
          })
        );
        return;
      }

      // Check the cache
      const pubKey = that._cachedPublicKeys[id];
      if (!!pubKey) {
        resolve(pubKey);
        return;
      }

      // Send request
      var path = "/publicKeys/" + id;
      that._feather._gateway
        .sendRequest("GET", path, null)
        .then(pubKey => {
          // Cache the key
          that._cachedPublicKeys[id] = pubKey;
          resolve(pubKey);
        })
        .catch(err => reject(err));
    });
  }
};

module.exports = publicKeys;
