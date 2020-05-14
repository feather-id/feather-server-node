const utils = {
  /**
   * Converts a string from PascalCase to camelCase
   */
  pascalToCamelCase: function(str) {
    return str[0].toLowerCase() + str.substring(1);
  },

  copy: function(source, deep) {
    var o, prop, type;

    if (typeof source != "object" || source === null) {
      // What do to with functions, throw an error?
      o = source;
      return o;
    }

    o = new source.constructor();

    for (prop in source) {
      if (source.hasOwnProperty(prop)) {
        type = typeof source[prop];

        if (deep && type == "object" && source[prop] !== null) {
          o[prop] = this.copy(source[prop]);
        } else {
          o[prop] = source[prop];
        }
      }
    }
    return o;
  },

  validateData: function(data, expects) {
    if (!data) {
      if (expects.isRequired) {
        throw new Error("request data not provided");
      } else {
        return;
      }
    }
    if (typeof data !== "object") {
      throw new Error("expected 'data' to be an object");
    }
    for (const [key, expectation] of Object.entries(expects.params)) {
      const value = data[key];
      if (!value) {
        if (expectation.isRequired) {
          throw new Error(`required param not provided: '${key}'`);
        } else {
          continue;
        }
      }

      if (typeof value !== expectation.type) {
        throw new Error(
          `expected param '${key}' to be of type '${expectation.type}'`
        );
      }
    }
  }
};

module.exports = utils;
