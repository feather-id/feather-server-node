"use strict";

const utils = require("../utils");
const {
  FeatherError,
  FeatherErrorType,
  FeatherErrorCode
} = require("../errors");

const users = {
  _gateway: null,

  /**
   * Creates a user
   * @arg credentialToken
   * @return user
   */
  create: function(credentialToken) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      var headers = {};
      if (credentialToken) {
        if (typeof credentialToken !== "string") {
          reject(
            new FeatherError({
              type: FeatherErrorType.VALIDATION,
              code: FeatherErrorCode.PARAMETER_INVALID,
              message: `expected param 'credentialToken' to be of type 'string'`
            })
          );
          return;
        }
        headers["X-Credential-Token"] = credentialToken;
      }

      // Send request
      const path = "/users";
      that._gateway
        .sendRequest("POST", path, null, headers)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * Lists users
   * @arg { limit, startingAfter, endingBefore  }
   * @return list
   */
  list: function(data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate data
      try {
        utils.validateData(data, {
          isRequired: false,
          params: {
            limit: {
              type: "number"
            },
            startingAfter: {
              type: "string"
            },
            endingBefore: {
              type: "string"
            }
          }
        });
      } catch (error) {
        reject(error);
        return;
      }

      // Send request
      const path = "/users";
      that._gateway
        .sendRequest("GET", path, data)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * Retrieves a user
   * @arg id
   * @return user
   */
  retrieve: function(id) {
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
      const path = "/users/" + id;
      that._gateway
        .sendRequest("GET", path, null)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * Updates a user
   * @arg id
   * @arg { metadata }
   * @return user
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
            metadata: {
              type: "object"
            }
          }
        });
      } catch (error) {
        reject(error);
        return;
      }

      // Send request
      const path = "/users/" + id;
      that._gateway
        .sendRequest("POST", path, data)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * Updates a user's email
   * @arg id
   * @arg newEmail
   * @arg credentialToken
   * @return user
   */
  updateEmail: function(id, newEmail, credentialToken) {
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
      if (typeof newEmail !== "string") {
        reject(
          new FeatherError({
            type: FeatherErrorType.VALIDATION,
            code: FeatherErrorCode.PARAMETER_INVALID,
            message: `expected param 'newEmail' to be of type 'string'`
          })
        );
        return;
      }
      if (typeof credentialToken !== "string") {
        reject(
          new FeatherError({
            type: FeatherErrorType.VALIDATION,
            code: FeatherErrorCode.HEADER_MISSING,
            message: `expected param 'credentialToken' to be of type 'string'`
          })
        );
      }
      const headers = { "X-Credential-Token": credentialToken };

      // Send request
      const path = "/users/" + id + "/email";
      const data = { newEmail };
      that._gateway
        .sendRequest("POST", path, data, headers)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * Updates a user's password
   * @arg id
   * @arg newPassword
   * @arg credentialToken
   * @return user
   */
  updatePassword: function(id, newPassword, credentialToken) {
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
      if (typeof newPassword !== "string") {
        reject(
          new FeatherError({
            type: FeatherErrorType.VALIDATION,
            code: FeatherErrorCode.PARAMETER_INVALID,
            message: `expected param 'newPassword' to be of type 'string'`
          })
        );
        return;
      }
      if (typeof credentialToken !== "string") {
        reject(
          new FeatherError({
            type: FeatherErrorType.VALIDATION,
            code: FeatherErrorCode.HEADER_MISSING,
            message: `expected param 'credentialToken' to be of type 'string'`
          })
        );
      }
      const headers = { "X-Credential-Token": credentialToken };

      // Send request
      const path = "/users/" + id + "/password";
      const data = { newPassword };
      that._gateway
        .sendRequest("POST", path, data, headers)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * Refreshes a user's tokens
   * @arg id
   * @arg refreshToken
   * @return user
   */
  refreshTokens: function(id, refreshToken) {
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
      if (typeof refreshToken !== "string") {
        reject(
          new FeatherError({
            type: FeatherErrorType.VALIDATION,
            code: FeatherErrorCode.PARAMETER_INVALID,
            message: `expected param 'refreshToken' to be of type 'string'`
          })
        );
        return;
      }
      const headers = { "X-Refresh-Token": refreshToken };

      // Send request
      const path = `/users/${id}/tokens`;
      that._gateway
        .sendRequest("POST", path, null, headers)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },

  /**
   * Revokes a user's tokens
   * @arg id
   * @arg refreshToken
   * @return user
   */
  revokeTokens: function(id, refreshToken) {
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
      if (typeof refreshToken !== "string") {
        reject(
          new FeatherError({
            type: FeatherErrorType.VALIDATION,
            code: FeatherErrorCode.PARAMETER_INVALID,
            message: `expected param 'refreshToken' to be of type 'string'`
          })
        );
        return;
      }
      const headers = { "X-Refresh-Token": refreshToken };

      // Send request
      const path = `/users/${id}/tokens`;
      that._gateway
        .sendRequest("DELETE", path, null, headers)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
};

module.exports = users;
