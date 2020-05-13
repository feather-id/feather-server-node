"use strict";

const credentialTypes = require("../credentialTypes");

const credentials = {
  _feather: null,

  create: function(type, email, username, password) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof type !== "string") {
        reject(new Error("Type must be a string"));
        return;
      }
      if (!Object.values(credentialTypes).includes(type)) {
        reject(new Error("Invalid credential type: " + type));
        return;
      }
      if (!!email && typeof email !== "string") {
        reject(new Error("Email must be a string"));
        return;
      }
      if (!!username && typeof username !== "string") {
        reject(new Error("Username must be a string"));
        return;
      }
      if (!!password && typeof password !== "string") {
        reject(new Error("Password must be a string"));
        return;
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
      return that._feather._gateway
        .sendRequest("POST", "/credentials", data)
        .then(res => mapToCredential(res))
        .then(credential => resolve(credential))
        .catch(err => reject(err));
    });
  },

  update: function(id, oneTimeCode) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(new Error("ID must be a string"));
        return;
      }
      if (typeof oneTimeCode !== "string") {
        reject(new Error("OneTimeCode must be a string"));
        return;
      }

      // Send request
      const data = {
        one_time_code: oneTimeCode
      };
      that._feather._gateway
        .sendRequest("POST", "/credentials/" + id, data)
        .then(res => mapToCredential(res))
        .then(credential => resolve(credential))
        .catch(err => reject(err));
    });
  }
};

function mapToCredential(res) {
  if (!res || res.object != "credential") {
    throw new Error("Cannot map response");
  }
  return {
    id: res.id,
    object: res.object,
    createdAt: Date.parse(res.created_at),
    expiresAt: Date.parse(res.expires_at),
    status: res.status,
    token: res.token,
    type: res.type
  };
}

module.exports = credentials;
