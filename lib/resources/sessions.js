"use strict";

const mapper = require("../mapper");

const sessions = {
  _feather: null,
  _parseToken: require("../parseToken"),
  create: function(credential) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      var data = {};
      if (!!credential) {
        data["credential_token"] = credential.token;
      }

      // Send request
      that._feather._gateway
        .sendRequest("POST", "/sessions", data)
        .then(res => mapper.toSession(res))
        .then(session => resolve(session))
        .catch(err => reject(err));
    });
  },

  list: function(userId) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof userId !== "string") {
        reject(new Error("User ID must be a string"));
        return;
      }

      // Send request
      var data = {
        user_id: userId
      };
      that._feather._gateway
        .sendRequest("GET", "/sessions", data)
        .then(res => mapper.toList(res))
        .then(session => resolve(session))
        .catch(err => reject(err));
    });
  },

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
        .sendRequest("GET", "/sessions", data)
        .then(res => mapper.toSession(res))
        .then(session => resolve(session))
        .catch(err => reject(err));
    });
  },

  revoke: function(id, session) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(new Error("ID must be a string"));
        return;
      }
      if (typeof session !== "object") {
        reject(new Error("Session must be an object"));
        return;
      }
      if (!session) {
        reject(new Error("Session cannot be null"));
        return;
      }

      // Send request
      const data = {
        session_token: session.token
      };
      const path = "/sessions/" + id + "/revoke";
      that._feather._gateway
        .sendRequest("POST", path, data)
        .then(res => mapper.toSession(res))
        .then(session => resolve(session))
        .catch(err => reject(err));
    });
  },

  upgrade: function(id, credential) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(new Error("ID must be a string"));
        return;
      }
      if (typeof credential !== "object") {
        reject(new Error("Credential must be an object"));
        return;
      }
      if (!credential) {
        reject(new Error("Credential cannot be null"));
        return;
      }

      // Send request
      const data = {
        credential_token: credential.token
      };
      const path = "/sessions/" + id + "/upgrade";
      that._feather._gateway
        .sendRequest("POST", path, data)
        .then(res => mapper.toSession(res))
        .then(session => resolve(session))
        .catch(err => reject(err));
    });
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
