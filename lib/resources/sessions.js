"use strict";

// TODO create mapper
// TODO map underscores to camelCase
// TODO map RFC3339 to Javascript dates

const sessions = {
  _feather: null,
  _parseToken: require("../parseToken"),
  create: function(credential) {
    // Validate input
    var data = {};
    if (!!credential) {
      data["credential_token"] = credential.token;
    }

    // Send request
    return this._feather._gateway.sendRequest("POST", "/sessions", data);
  },

  list: function(userId) {
    // Validate input
    if (typeof userId !== "string") {
      throw new Error("User ID must be a string");
    }

    // Send request
    var data = {
      user_id: userId
    };
    return this._feather._gateway.sendRequest("GET", "/sessions", data);
  },

  retrieve: function(id) {
    // Validate input
    if (typeof id !== "string") {
      throw new Error("ID must be a string");
    }

    // Send request
    var data = { id };
    return this._feather._gateway.sendRequest("GET", "/sessions", data);
  },

  revoke: function(id, session) {
    // Validate input
    if (typeof id !== "string") {
      throw new Error("ID must be a string");
    }
    if (typeof session !== "object") {
      throw new Error("Session must be an object");
    }
    if (!session) {
      throw new Error("Session cannot be null");
    }

    // Send request
    const data = {
      session_token: session.token
    };
    const path = "/sessions/" + id + "/revoke";
    return this._feather._gateway.sendRequest("POST", path, data);
  },

  upgrade: function(id, credential) {
    // Validate input
    if (typeof id !== "string") {
      throw new Error("ID must be a string");
    }
    if (typeof credential !== "object") {
      throw new Error("Credential must be an object");
    }
    if (!credential) {
      throw new Error("Credential cannot be null");
    }

    // Send request
    const data = {
      credential_token: credential.token
    };
    const path = "/sessions/" + id + "/upgrade";
    return this._feather._gateway.sendRequest("POST", path, data);
  },

  validate: function(token) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Parse token locally
      that
        ._parseToken(token, that._feather.publicKeys)
        .then(session => {
          // If session is active, just resolve
          if (session.status === "active") {
            resolve(session);
            return;
          }

          // Send request
          const data = {
            session_token: token
          };
          const path = "/sessions/" + session.id + "/validate";
          that._feather._gateway
            .sendRequest("POST", path, data)
            .then(res => resolve(res))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
};

module.exports = sessions;
