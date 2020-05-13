"use strict";

module.exports = {
  toCredential: function(obj) {
    if (!obj || obj.object != "credential") {
      throw new Error("Cannot map object to credential");
    }
    return {
      id: obj.id,
      object: obj.object,
      createdAt: this.toNullableDate(obj.created_at),
      expiresAt: this.toNullableDate(obj.expires_at),
      status: obj.status,
      token: obj.token,
      type: obj.type
    };
  },

  toList: function(obj) {
    if (!obj || obj.object != "list") {
      throw new Error("Cannot map object to list");
    }
    var mappedData = [];
    for (let d in obj.data) {
      switch (d.object) {
        case "credential":
          mappedData.push(this.toCredential(d));

        case "session":
          mappedData.push(this.toSession(d));

        case "user":
          mappedData.push(this.toUser(d));
      }
    }
    return {
      object: obj.object,
      url: obj.url,
      hasMore: obj.has_more,
      data: mappedData
    };
  },

  toNullableDate: function(obj) {
    return obj ? Date.parse(obj) : null;
  },

  toSession: function(obj) {
    if (!obj || obj.object != "session") {
      throw new Error("Cannot map object to session");
    }
    return {
      id: obj.id,
      object: obj.object,
      type: obj.type,
      status: obj.status,
      token: obj.token,
      userId: obj.user_id,
      createdAt: this.toNullableDate(obj.created_at),
      revokedAt: this.toNullableDate(obj.revoked_at)
    };
  },

  toUser: function(obj) {
    if (!obj || obj.object != "user") {
      throw new Error("Cannot map object to user");
    }
    return {
      id: obj.id,
      object: obj.object,
      email: obj.email,
      username: obj.username,
      metadata: JSON.parse(obj.metadata),
      createdAt: this.toNullableDate(obj.created_at),
      updatedAt: this.toNullableDate(obj.updated_at)
    };
  }
};
