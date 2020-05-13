"use strict";

// TODO create mapper
// TODO map underscores to camelCase
// TODO map RFC3339 to Javascript dates

const users = {
  _feather: null,

  retrieve: function(id) {
    // Validate input
    if (typeof id !== "string") {
      throw new Error("ID must be a string");
    }

    // Send request
    var data = { id };
    return this._feather._gateway.sendRequest("GET", "/users", data);
  },

  update: function(id, email, username, metadata) {
    // Validate input
    if (typeof id !== "string") {
      throw new Error("ID must be a string");
    }
    if (!!email && typeof email !== "string") {
      throw new Error("Email must be a string");
    }
    if (!!username && typeof username !== "string") {
      throw new Error("Username must be a string");
    }
    if (!!metadata && typeof metadata !== "object") {
      throw new Error("Metadata must be an object");
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
    return this._feather._gateway.sendRequest("POST", "/users/" + id, data);
  }
};

module.exports = users;
