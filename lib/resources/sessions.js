"use strict";

const sessions = {
  _feather: null,

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
    return this._feather._gateway.sendRequest(
      "POST",
      "/sessions/" + id + "/revoke",
      data
    );
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
    return this._feather._gateway.sendRequest(
      "POST",
      "/sessions/" + id + "/upgrade",
      data
    );
  },

  validate: function(token) {
    // TODO parse token locally
    // TODO if valid but expired, send request
  }
};

module.exports = sessions;
