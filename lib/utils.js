const utils = {
  /**
   * Converts a string from PascalCase to camelCase
   */
  pascalToCamelCase: function(name) {
    return name[0].toLowerCase() + name.substring(1);
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
  }
};

module.exports = utils;
