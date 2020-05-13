"use strict";

const https = require("https");
const querystring = require("querystring");

const DEFAULT_HOST = "api.feather.id";
const DEFAULT_PORT = "443";
const DEFAULT_BASE_PATH = "/v1";

function Gateway(apiKey, config = {}) {
  this._api = {
    auth: "Basic " + Buffer.from(apiKey + ":").toString("base64"),
    host: config.host || DEFAULT_HOST,
    port: config.port || DEFAULT_PORT,
    protocol: config.protocol || "https",
    basePath: DEFAULT_BASE_PATH
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
      if (data) {
        data = querystring.stringify(data);
        headers["Content-Length"] = Buffer.byteLength(data);
      }

      // Build query parameters
      var queryParams = "";
      if (method === "GET" && data) {
        query = "?";
        for (let key in data) {
          query += key + "=" + data[key];
        }
      }

      // Build request options
      var options = {
        host: that._api.host,
        path: that._api.basePath + path + queryParams,
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
          switch (res.statusCode) {
            case 200:
              body = Buffer.concat(body).toString();
              resolve(JSON.parse(body));
              return;

            case 201:
              body = Buffer.concat(body).toString();
              resolve(JSON.parse(body));
              return;

            default:
              resolve(res.statusCode);
              return;
          }
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
