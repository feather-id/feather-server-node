"use strict";

const mapper = require("../mapper");
const utils = require("../utils");

const users = {
  _feather: null,

  // TODO add list params
  list: function() {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Send request
      that._feather._gateway
        .sendRequest("GET", "/users", null)
        .then(res => mapper.toList(res))
        .then(list => resolve(list))
        .catch(err => reject(err));
    });
  },

  retrieve: function(id) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(new Error(`expected param 'id' to be of type 'string'`));
        return;
      }

      // Send request
      var data = { id };
      that._feather._gateway
        .sendRequest("GET", "/users", data)
        .then(res => mapper.toUser(res))
        .then(user => resolve(user))
        .catch(err => reject(err));
    });
  },

  // email, username, metadata
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
            email: {
              type: "string"
            },
            username: {
              type: "string"
            },
            metadata: {
              type: "object"
            }
          }
        });
      } catch (error) {
        reject(error);
        return;
      }
      // if (!!email && typeof email !== "string") {
      //   reject(Error("Email must be a string"));
      //   return;
      // }
      // if (!!username && typeof username !== "string") {
      //   reject(Error("Username must be a string"));
      //   return;
      // }
      // if (!!metadata && typeof metadata !== "object") {
      //   reject(Error("Metadata must be an object"));
      //   return;
      // }

      // Send request
      // const data = {};
      // if (!!email) {
      //   data["email"] = email;
      // }
      // if (!!username) {
      //   data["username"] = username;
      // }
      // if (!!metadata) {
      //   data["metadata"] = JSON.stringify(metadata);
      // }
      if (data.metadata) {
        data.metadata = JSON.stringify(data.metadata);
      }
      that._feather._gateway
        .sendRequest("POST", "/users/" + id, data)
        .then(res => mapper.toUser(res))
        .then(user => resolve(user))
        .catch(err => reject(err));
    });
  }
};

module.exports = users;
