"use strict";

const credentialTypes = require("../credentialTypes");
const mapper = require("../mapper");
const utils = require("../utils");

const credentials = {
  _feather: null,

  /**
   * Creates a credential
   * @arg { type, email, username, password }
   * @return credential
   */
  create: function(data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      try {
        utils.validateData(data, {
          isRequired: true,
          params: {
            type: {
              type: "string",
              isRequired: true
            },
            email: {
              type: "string"
            },
            username: {
              type: "string"
            },
            password: {
              type: "string"
            }
          }
        });
      } catch (error) {
        reject(error);
        return;
      }

      // Send request
      return that._feather._gateway
        .sendRequest("POST", "/credentials", data)
        .then(res => mapper.toCredential(res))
        .then(credential => resolve(credential))
        .catch(err => reject(err));
    });
  },

  /**
   * Updates a credential
   * @arg id
   * @arg { one_time_code }
   * @return the updated credential
   */
  update: function(id, data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(new Error(`expected param 'id' to be of type 'string'`));
        return;
      }
      try {
        utils.validateData(data, {
          isRequired: true,
          params: {
            one_time_code: {
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
      const path = "/credentials/" + id;
      that._feather._gateway
        .sendRequest("POST", path, data)
        .then(res => mapper.toCredential(res))
        .then(credential => resolve(credential))
        .catch(err => reject(err));
    });
  }
};

module.exports = credentials;
