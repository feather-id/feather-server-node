"use strict";

const gateway = require("./gateway");
const resources = require("./resources");

const ALLOWED_CONFIG_PROPERTIES = ["host", "port", "protocol"];

function Feather(apiKey, config = {}) {
  if (!(this instanceof Feather)) {
    return new Feather(apiKey, config);
  }

  // Validate apiKey
  if (typeof apiKey !== "string") {
    throw new Error("API key must be a string");
  }

  // Validate config
  this._validateConfig(config);

  this._gateway = new gateway(apiKey, config);

  this._prepareResources();
}

/**
 *
 */
const pascalToCamelCase = function(name) {
  return name[0].toLowerCase() + name.substring(1);
};

Feather.prototype = {
  /**
   * @private
   * This may be removed in the future.
   */
  _prepareResources() {
    for (const name in resources) {
      resources[name]._feather = this;
      this[pascalToCamelCase(name)] = resources[name];
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
      throw new Error("Config must an object");
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
