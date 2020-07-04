"use strict";

var jws = require("jws");
const {
  FeatherError,
  FeatherErrorType,
  FeatherErrorCode
} = require("./errors");

const idTokenVerifier = {
  _gateway: null,
  _cachedJWKs: {},
  _cachedAudience: null,

  /**
   * @private
   * This may be removed in the future.
   */
  _getAudience: function() {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Check the cache
      if (that._cachedAudience) {
        resolve(that._cachedAudience);
        return;
      }

      // Send request
      var path = "/.well-known/aud";
      that._gateway
        .sendRequest("GET", path, null)
        .then(aud => {
          // Cache the audience
          that._cachedAudience = aud.aud;
          resolve(aud.aud);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * @private
   * This may be removed in the future.
   *
   * Retrieves a public JWK
   * @arg id
   * @return jwk
   */
  _getJWK: function(id) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Check the cache
      const jwk = that._cachedJWKs[id];
      if (!!jwk) {
        resolve(jwk);
        return;
      }

      // Send request
      var path = `/.well-known/jwks/${id}.json`;
      that._gateway
        .sendRequest("GET", path, null)
        .then(jwk => {
          // Cache the key
          that._cachedJWKs[id] = jwk;
          resolve(jwk);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  verifyIdToken: function(tokenStr) {
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

      // Decode the token
      const decodedToken = jws.decode(tokenStr);
      if (!decodedToken) {
        reject(invalidTokenError);
        return;
      }

      // Verify signature algorithm
      const rs256 = "RS256";
      if (decodedToken.header.alg != rs256) {
        reject(invalidTokenError);
        return;
      }

      // Get the key ID
      if (!decodedToken.header.kid) {
        reject(invalidTokenError);
        return;
      }

      // Check cache for the key
      that
        ._getJWK(decodedToken.header.kid)
        .then(jwk => Promise.all([jwk, that._getAudience()]))
        .then(([jwk, audience]) => {
          // Verify signature

          try {
            const isValid = jws.verify(tokenStr, rs256, jwk.pem);
            if (!isValid) {
              reject(invalidTokenError);
              return;
            }
          } catch (e) {
            reject(invalidTokenError);
            return;
          }

          // Verify claims
          if (decodedToken.payload.iss !== "feather") {
            reject(invalidTokenError);
            return;
          }
          if (decodedToken.payload.sub.substring(0, 4) !== "USR_") {
            reject(invalidTokenError);
            return;
          }
          if (decodedToken.payload.aud !== audience) {
            reject(invalidTokenError);
            return;
          }

          // TODO Give buffer for clock skew?
          const now = Math.floor(Date.now() / 1000);
          if (now > decodedToken.payload.exp) {
            reject(expiredTokenError);
            return;
          }

          // Return the parsed user
          const user = {
            id: decodedToken.payload.sub,
            object: "user"
          };
          resolve(user);
        })
        .catch(err => reject(err));
    });
  }
};

module.exports = idTokenVerifier;
