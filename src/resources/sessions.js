"use strict";

const utils = require("../utils");
const {
  FeatherError,
  FeatherErrorType,
  FeatherErrorCode
} = require("../errors");

const sessions = {
  _gateway: null,
  // _cachedPublicKeys: {},

  /**
   * Creates a new session
   * @arg { credentialToken }
   * @return session
   */
  create: function(data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      try {
        utils.validateData(data, {
          isRequired: false,
          params: {
            credentialToken: {
              type: "string"
            }
          }
        });
      } catch (error) {
        reject(error);
        return;
      }

      // Send request
      that._gateway
        .sendRequest("POST", "/sessions", data)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * List a user's sessions
   * @arg { userId, limit, startingAfter, endingBefore  }
   * @return list
   */
  // list: function(data) {
  //   const that = this;
  //   return new Promise(function(resolve, reject) {
  //     // Validate data
  //     try {
  //       utils.validateData(data, {
  //         isRequired: true,
  //         params: {
  //           userId: {
  //             type: "string",
  //             isRequired: true
  //           },
  //           limit: {
  //             type: "number"
  //           },
  //           startingAfter: {
  //             type: "string"
  //           },
  //           endingBefore: {
  //             type: "string"
  //           }
  //         }
  //       });
  //     } catch (error) {
  //       reject(error);
  //       return;
  //     }
  //
  //     // Send request
  //     that._gateway
  //       .sendRequest("GET", "/sessions", data)
  //       .then(res => resolve(res))
  //       .catch(err => reject(err));
  //   });
  // },

  /**
   * Retrieves a session
   * @arg id
   * @return session
   */
  // retrieve: function(id) {
  //   const that = this;
  //   return new Promise(function(resolve, reject) {
  //     // Validate input
  //     if (typeof id !== "string") {
  //       reject(
  //         new FeatherError({
  //           type: FeatherErrorType.VALIDATION,
  //           code: FeatherErrorCode.PARAMETER_INVALID,
  //           message: `expected param 'id' to be of type 'string'`
  //         })
  //       );
  //       return;
  //     }
  //
  //     // Send request
  //     const path = "/sessions/" + id;
  //     that._gateway
  //       .sendRequest("GET", path, null)
  //       .then(res => resolve(res))
  //       .catch(err => reject(err));
  //   });
  // },

  /**
   * TODO require a refresh token
   *
   * Revokes a session
   * @arg id
   * @return session
   */
  revoke: function(id) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(
          new FeatherError({
            type: FeatherErrorType.VALIDATION,
            code: FeatherErrorCode.PARAMETER_INVALID,
            message: `expected param 'id' to be of type 'string'`
          })
        );
        return;
      }

      // Send request
      const path = "/sessions/" + id + "/revoke";
      that._gateway
        .sendRequest("POST", path, null)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * Updates a session
   * @arg id
   * @arg { credentialToken }
   * @return session
   */
  update: function(id, data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(
          new FeatherError({
            type: FeatherErrorType.VALIDATION,
            code: FeatherErrorCode.PARAMETER_INVALID,
            message: `expected param 'id' to be of type 'string'`
          })
        );
        return;
      }
      try {
        utils.validateData(data, {
          isRequired: true,
          params: {
            credentialToken: {
              type: "string",
              isRequired: true
            }
          }
        });
      } catch (error) {
        reject(error);
        return;
      }

      // Send request
      const path = "/sessions/" + id;
      that._gateway
        .sendRequest("POST", path, data)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  /**
   * Validates a session token
   * @arg sessionToken
   * @return session
   */
  // validate: function(sessionToken) {
  //   const that = this;
  //
  // /**
  //  * Retrieves a public key
  //  * @arg id
  //  * @return publicKey
  //  */
  // const getPublicKey = function(id) {
  //   return new Promise(function(resolve, reject) {
  //     // Check the cache
  //     const pubKey = that._cachedPublicKeys[id];
  //     if (!!pubKey) {
  //       resolve(pubKey);
  //       return;
  //     }
  //
  //     // Send request
  //     var path = "/publicKeys/" + id;
  //     that._gateway
  //       .sendRequest("GET", path, null)
  //       .then(pubKey => {
  //         // Cache the key
  //         that._cachedPublicKeys[id] = pubKey;
  //         resolve(pubKey);
  //       })
  //       .catch(err => reject(err));
  //   });
  // };
  //
  //   return new Promise(function(resolve, reject) {
  //     // Validate input
  //     if (typeof sessionToken !== "string") {
  //       reject(
  //         new FeatherError({
  //           type: FeatherErrorType.VALIDATION,
  //           code: FeatherErrorCode.PARAMETER_INVALID,
  //           message: `expected param 'sessionToken' to be of type 'string'`
  //         })
  //       );
  //       return;
  //     }
  //
  //     // Parse token locally
  //     that
  //       ._parseToken(sessionToken, getPublicKey)
  //       .then(session => resolve(session))
  //       .catch(err => reject(err));
  //   });
  // }
};

module.exports = sessions;
