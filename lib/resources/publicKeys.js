"use strict";

const publicKeys = {
  _feather: null,
  _cachedPublicKeys: {},
  retrieve: function(id) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Validate input
      if (typeof id !== "string") {
        reject(new Error("ID must be a string"));
        return;
      }

      // Check the cache
      const pubKey = that._cachedPublicKeys[id];
      if (!!pubKey) {
        resolve(pubKey);
        return;
      }

      // Send request
      var path = "/publicKeys/" + id;
      that._feather._gateway
        .sendRequest("GET", path, null)
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
