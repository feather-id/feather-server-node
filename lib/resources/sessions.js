"use strict";

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
      return that._feather._gateway.sendRequest("POST", "/sessions", data);
    });
  },

  /**
   * List a user's sessions
   * @arg { user_id, limit, starting_after, ending_before  }
   * @return list
   */
  list: function(data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate data
      try {
        utils.validateData(data, {
          isRequired: true,
          params: {
            user_id: {
              type: "string",
              isRequired: true
            },
            limit: {
              type: "number"
            },
            starting_after: {
              type: "string"
            },
            ending_before: {
              type: "string"
            }
          }
        });
      } catch (error) {
        reject(error);
        return;
      }

      // Send request
      return that._feather._gateway.sendRequest("GET", "/sessions", data);
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
      return that._feather._gateway.sendRequest("GET", path, null);
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
      return that._feather._gateway.sendRequest("POST", path, data);
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
      return that._feather._gateway.sendRequest("POST", path, data);
    });
  },

  /**
   * Validates a session token
   * @arg session_token
   * @return session
   */
  validate: function(data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
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

      // Parse token locally
      that
        ._parseToken(data.session_token, that._feather.publicKeys)
        .then(session => {
          // If session is active, just resolve
          if (session.status === "active") {
            resolve(session);
            return;
          }

          // Send request
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
