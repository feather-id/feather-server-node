"use strict";

const gateway = require("./gateway");
const resources = require("./resources");
const utils = require("./utils");

const ALLOWED_CONFIG_PROPERTIES = ["host", "port", "protocol", "basePath"];

function Feather(apiKey, config = {}) {
  if (!(this instanceof Feather)) {
    return new Feather(apiKey, config);
  }

  // Validate inputs
  if (typeof apiKey !== "string") {
    throw new Error("API key must be a string");
  }
  config = this._validateConfig(config);

  // Initialize the SDK
  this._gateway = new gateway(apiKey, config);
  this._prepareResources();
  return this;
}

Feather.prototype = {
  /**
   * @private
   * This may be removed in the future.
   */
  _prepareResources() {
    for (let name in resources) {
      var resource = { ...resources[name] };
      resource._feather = this;
      this[utils.pascalToCamelCase(name)] = resource;
    }
  },

  /**
   * @private
   * This may be removed in the future.
   */
  _validateConfig(config) {
    // If config is null or undefined, just bail early with no props
    if (!config) {
      return {};
    }

    // Config can only be an object
    if (typeof config !== "object") {
      throw new Error("Config must be an object");
    }

    // Verify the config does not contain any unexpected values
    const values = Object.keys(config).filter(
      value => !ALLOWED_CONFIG_PROPERTIES.includes(value)
    );
    if (values.length > 0) {
      throw new Error(
        `Config may not contain the following attributes: ${values.join(", ")}`
      );
    }

    return config;
  }
};

module.exports = Feather;
module.exports.Feather = Feather;
module.exports.default = Feather;
