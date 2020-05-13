"use strict";

const https = require("https");
const querystring = require("querystring");

const DEFAULT_HOST = "api.feather.id";
const DEFAULT_PORT = "443";
const DEFAULT_PROTOCOL = "https";
const DEFAULT_BASE_PATH = "/v1";

function Gateway(apiKey, config = {}) {
  if (!(this instanceof Gateway)) {
    return new Gateway(apiKey, config);
  }

  this._api = {
    auth: "Basic " + Buffer.from(apiKey + ":").toString("base64"),
    host: config.host || DEFAULT_HOST,
    port: config.port || DEFAULT_PORT,
    protocol: config.protocol || DEFAULT_PROTOCOL,
    basePath: config.basePath || DEFAULT_BASE_PATH
  };
}

Gateway.prototype = {
  sendRequest(method, path, data) {
    const that = this;
    return new Promise(function(resolve, reject) {
      // Build headers
      var headers = {
        Authorization: that._api.auth,
        "Content-Type": "application/x-www-form-urlencoded"
      };

      // Build request data
      var query = "";
      if (data) {
        switch (method) {
          case "GET":
            query = "?";
            for (let [key, value] of Object.entries(data)) {
              query += key + "=" + value;
            }
            break;

          case "POST":
            data = querystring.stringify(data);
            headers["Content-Length"] = Buffer.byteLength(data);
            break;
        }
      }

      // Build request options
      var options = {
        host: that._api.host,
        path: that._api.basePath + path + query,
        method: method,
        headers
      };

      // Build production request
      var req = https.request(options, function(res) {
        res.setEncoding("utf8");
        let body = [];
        res.on("data", function(chunk) {
          body.push(Buffer.from(chunk, "utf-8"));
        });
        res.on("end", function() {
          body = Buffer.concat(body).toString();
          resolve(JSON.parse(body));
          return;
        });
      });

      // Handle errors
      req.on("error", err => reject(err));

      // Post data
      if (method === "POST" && data) {
        req.write(data);
      }
      req.end();
    });
  }
};

module.exports = Gateway;
