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
      that._feather._gateway
        .sendRequest("GET", "/publicKeys", data)
        .then(pubKey => {
          // Cache the key
          that._cachedPublicKeys[id] = pubKey;
          resolve(pubKey);
        })
        .catch(err => reject(err));
    });
  }
};

module.exports = publicKeys;
