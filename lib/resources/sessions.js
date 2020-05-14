"use strict";

const mapper = require("../mapper");
const utils = require("../utils");

const sessions = {
  _feather: null,
  _parseToken: require("../parseToken"),

  /**
   * Creates a new session
   * @arg { credential_token }
   * @return session
   */
  create: function(data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      try {
        utils.validateData(data, {
          isRequired: false,
          params: {
            credential_token: {
              type: "string"
            }
          }
        });
      } catch (error) {
        reject(error);
        return;
      }

      // Send request
      that._feather._gateway
        .sendRequest("POST", "/sessions", data)
        .then(res => mapper.toSession(res))
        .then(session => resolve(session))
        .catch(err => reject(err));
    });
  },

  list: function(data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      try {
        utils.validateData(data, {
          isRequired: false,
          params: {
            user_id: {
              type: "string"
            }
            // TODO other /list params
          }
        });
      } catch (error) {
        reject(error);
        return;
      }

      // Send request
      that._feather._gateway
        .sendRequest("GET", "/sessions", data)
        .then(res => mapper.toList(res))
        .then(list => resolve(list))
        .catch(err => reject(err));
    });
  },

  /**
   * Retrieves a session
   * @arg id
   * @return session
   */
  retrieve: function(id) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(new Error("expected param 'id' to be of type 'string'"));
        return;
      }

      // Send request
      const path = "/sessions/" + id;
      that._feather._gateway
        .sendRequest("GET", path, null)
        .then(res => mapper.toSession(res))
        .then(session => resolve(session))
        .catch(err => reject(err));
    });
  },

  /**
   * Revokes a session
   * @arg id
   * @arg { session_token }
   * @return session
   */
  revoke: function(id, data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(new Error("ID must be a string"));
        return;
      }
      try {
        utils.validateData(data, {
          isRequired: true,
          params: {
            session_token: {
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
      const path = "/sessions/" + id + "/revoke";
      that._feather._gateway
        .sendRequest("POST", path, data)
        .then(res => mapper.toSession(res))
        .then(session => resolve(session))
        .catch(err => reject(err));
    });
  },

  /**
   * Upgrades a session
   * @arg id
   * @arg { credential_token }
   * @return session
   */
  upgrade: function(id, data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(new Error("ID must be a string"));
        return;
      }
      try {
        utils.validateData(data, {
          isRequired: true,
          params: {
            credential_token: {
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
      const path = "/sessions/" + id + "/upgrade";
      that._feather._gateway
        .sendRequest("POST", path, data)
        .then(res => mapper.toSession(res))
        .then(session => resolve(session))
        .catch(err => reject(err));
    });
  },

  /**
   * Validates a session token
   * @arg token
   * @return session
   */
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
