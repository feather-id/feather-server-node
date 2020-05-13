const utils = {
  /**
   * Converts a string from PascalCase to camelCase
   */
  pascalToCamelCase: function(name) {
    return name[0].toLowerCase() + name.substring(1);
  }
};

module.exports = utils;
