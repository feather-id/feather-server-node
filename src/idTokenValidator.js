"use strict";

var jws = require("jws");
const {
  FeatherError,
  FeatherErrorType,
  FeatherErrorCode
} = require("./errors");

const tokenValidator = {
  _gateway: null,
  _cachedPublicKeys: {},

  /**
   * @private
   * This may be removed in the future.
   *
   * Retrieves a public key
   * @arg id
   * @return publicKey
   */
  _getPublicKey: function(id) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Check the cache
      const pubKey = that._cachedPublicKeys[id];
      if (!!pubKey) {
        resolve(pubKey);
        return;
      }

      // Send request
      var path = "/publicKeys/" + id;
      that._gateway
        .sendRequest("GET", path, null)
        .then(pubKey => {
          // Cache the key
          that._cachedPublicKeys[id] = pubKey;
          resolve(pubKey);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  validateIDToken: function(tokenString, getPublicKey) {
    const that = this;
    return new Promise(function(resolve, reject) {
      const invalidTokenError = new FeatherError({
        type: FeatherErrorType.VALIDATION,
        code: FeatherErrorCode.TOKEN_INVALID,
        message: "The session token is invalid"
      });
      const expiredTokenError = new FeatherError({
        type: FeatherErrorType.VALIDATION,
        code: FeatherErrorCode.TOKEN_EXPIRED,
        message: "The session token is expired"
      });

      // Parse the token
      const parsedToken = jws.decode(tokenString);
      if (!parsedToken) {
        reject(invalidTokenError);
        return;
      }

      // Verify signature algorithm
      const rs256 = "RS256";
      if (parsedToken.header.alg != rs256) {
        reject(invalidTokenError);
        return;
      }

      // Get the key ID
      if (!parsedToken.header.kid) {
        reject(invalidTokenError);
        return;
      }

      // Check cache for the key
      that
        ._getPublicKey(parsedToken.header.kid)
        .then(pubKey => {
          // Verify signature

          try {
            const isValid = jws.verify(tokenString, rs256, pubKey.pem);
            if (!isValid) {
              reject(invalidTokenError);
              return;
            }
          } catch (e) {
            reject(invalidTokenError);
            return;
          }

          // Verify claims
          if (parsedToken.payload.iss !== "feather") {
            reject(invalidTokenError);
            return;
          }
          if (parsedToken.payload.sub.substring(0, 4) !== "USR_") {
            reject(invalidTokenError);
            return;
          }
          if (parsedToken.payload.aud.substring(0, 4) !== "PRJ_") {
            reject(invalidTokenError);
            return;
          }

          // ***IMPORTANT***
          // TODO Validate *my* project is the audience
          // Otherwise any old Feather token can make it through here.

          // TODO Give buffer for clock skew?
          const now = Math.floor(Date.now() / 1000);
          if (now > parsedToken.payload.exp) {
            reject(expiredTokenError);
            return;
          }

          // Return the parsed user
          const user = {
            id: parsedToken.payload.sub,
            object: "user"
          };
          resolve(user);
        })
        .catch(err => reject(err));
    });
  }
};

module.exports = tokenValidator;
