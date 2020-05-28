"use strict";

const utils = require("../utils");
const FeatherError = require("../errors/featherError");
const ErrorType = require("../errors/errorType");
const ErrorCode = require("../errors/errorCode");

const sessions = {
  _gateway: null,
  _parseToken: require("../parseToken"),
  _cachedPublicKeys: {},

  /**
   * Creates a new session
   * @arg { credential_token }
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
            credential_token: {
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
   * @arg { user_id, limit, starting_after, ending_before  }
   * @return list
   */
  list: function(data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate data
      try {
        utils.validateData(data, {
          isRequired: true,
          params: {
            user_id: {
              type: "string",
              isRequired: true
            },
            limit: {
              type: "number"
            },
            starting_after: {
              type: "string"
            },
            ending_before: {
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
        .sendRequest("GET", "/sessions", data)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * Retrieves a session
   * @arg id
   * @return session
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

      // Send request
      const path = "/sessions/" + id;
      that._gateway
        .sendRequest("GET", path, null)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * Revokes a session
   * @arg id
   * @arg { session_token }
   * @return session
   */
  revoke: function(id, data) {
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
      try {
        utils.validateData(data, {
          isRequired: true,
          params: {
            session_token: {
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
      const path = "/sessions/" + id + "/revoke";
      that._gateway
        .sendRequest("POST", path, data)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * Upgrades a session
   * @arg id
   * @arg { credential_token }
   * @return session
   */
  upgrade: function(id, data) {
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
      try {
        utils.validateData(data, {
          isRequired: true,
          params: {
            credential_token: {
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
      const path = "/sessions/" + id + "/upgrade";
      that._gateway
        .sendRequest("POST", path, data)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * Validates a session token
   * @arg { session_token }
   * @return session
   */
  validate: function(data) {
    const that = this;

    /**
     * Retrieves a public key
     * @arg id
     * @return publicKey
     */
    const getPublicKey = function(id) {
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
        that._gateway
          .sendRequest("GET", path, null)
          .then(pubKey => {
            // Cache the key
            that._cachedPublicKeys[id] = pubKey;
            resolve(pubKey);
          })
          .catch(err => reject(err));
      });
    };

    return new Promise(function(resolve, reject) {
      // Validate input
      try {
        utils.validateData(data, {
          isRequired: true,
          params: {
            session_token: {
              type: "string",
              isRequired: true
            }
          }
        });
      } catch (error) {
        reject(error);
        return;
      }

      // Parse token locally
      that
        ._parseToken(data.session_token, getPublicKey)
        .then(session => {
          // If session is active, just resolve
          if (session.status === "active") {
            resolve(session);
            return;
          }

          // Send request
          const path = "/sessions/" + session.id + "/validate";
          that._gateway
            .sendRequest("POST", path, data)
            .then(res => resolve(res))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
};

module.exports = sessions;
