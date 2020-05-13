"use strict";

const publicKeys = {
  _feather: null,
  _cachedPublicKeys: {},
  retrieve: function(id) {
    // Validate input
    if (typeof id !== "string") {
      throw new Error("ID must be a string");
    }

    const that = this;
    return new Promise(function(resolve, reject) {
      // Check the cache
      const pubKey = that._cachedPublicKeys[id];
      if (!!pubKey) {
        resolve(pubKey);
        return;
      }

      // Send request
      var data = { id };
      return that._feather._gateway.sendRequest(
        "GET",
        "/publicKeys/" + id,
        null
      );
    });
  }
};

module.exports = publicKeys;
