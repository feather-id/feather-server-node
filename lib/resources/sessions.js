"use strict";

const sessions = {
  _feather: null,

  create: function(credential) {
    var data = {};
    if (!!credential) {
      data["credential_token"] = credential.token;
    }
    return this._feather._gateway.sendRequest("POST", "/sessions", data);
  },

  retrieve: function(id) {
    return this._feather._gateway.sendRequest("GET", "/sessions/" + id, null);
  }
};

module.exports = sessions;
