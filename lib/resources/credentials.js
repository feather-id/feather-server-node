"use strict";

const credentials = {
  _feather: null,

  create: function(type, email, username, password) {
    // Validate input
    if (typeof type !== "string") {
      throw new Error("Type must be a string");
    }
    if (!!email && typeof email !== "string") {
      throw new Error("Email must be a string");
    }
    if (!!username && typeof username !== "string") {
      throw new Error("Username must be a string");
    }
    if (!!password && typeof password !== "string") {
      throw new Error("Password must be a string");
    }

    // Send request
    var data = { type };
    if (!!email) {
      data["email"] = email;
    }
    if (!!username) {
      data["username"] = username;
    }
    if (!!password) {
      data["password"] = password;
    }
    return this._feather._gateway.sendRequest("POST", "/credentials", data);
  },

  update: function(id, oneTimeCode) {
    // Validate input
    if (typeof id !== "string") {
      throw new Error("ID must be a string");
    }
    if (typeof oneTimeCode !== "string") {
      throw new Error("OneTimeCode must be a string");
    }

    // Send request
    const data = {
      one_time_code: oneTimeCode
    };
    return this._feather._gateway.sendRequest(
      "POST",
      "/credentials/" + id,
      data
    );
  }
};

module.exports = credentials;
