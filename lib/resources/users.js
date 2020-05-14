"use strict";

const utils = require("../utils");

const users = {
  _feather: null,

  /**
   * Lists users
   * @arg { limit, starting_after, ending_before  }
   * @return list
   */
  list: function(data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate data
      try {
        utils.validateData(data, {
          isRequired: false,
          params: {
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
      return that._feather._gateway.sendRequest("GET", "/users", data);
    });
  },

  /**
   * Retrieves a user
   * @arg id
   * @return user
   */
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
      return that._feather._gateway.sendRequest("GET", "/users", data);
    });
  },

  /**
   * Updates a user
   * @arg id
   * @arg { email, username, metadata }
   * @return user
   */
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

      if (data.metadata) {
        data.metadata = JSON.stringify(data.metadata);
      }
      return that._feather._gateway.sendRequest("POST", "/users/" + id, data);
    });
  }
};

module.exports = users;
