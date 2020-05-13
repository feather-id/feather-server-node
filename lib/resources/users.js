"use strict";

// TODO implement /list endpoint

const mapper = require("../mapper");

const users = {
  _feather: null,

  retrieve: function(id) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(new Error("ID must be a string"));
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

  update: function(id, email, username, metadata) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(Error("ID must be a string"));
        return;
      }
      if (!!email && typeof email !== "string") {
        reject(Error("Email must be a string"));
        return;
      }
      if (!!username && typeof username !== "string") {
        reject(Error("Username must be a string"));
        return;
      }
      if (!!metadata && typeof metadata !== "object") {
        reject(Error("Metadata must be an object"));
        return;
      }

      // Send request
      const data = {};
      if (!!email) {
        data["email"] = email;
      }
      if (!!username) {
        data["username"] = username;
      }
      if (!!metadata) {
        data["metadata"] = JSON.stringify(metadata);
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
