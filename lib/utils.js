const utils = {
  /**
   * Outputs a new function with interpolated object property values.
   * Use like so:
   *   var fn = makeURLInterpolator('some/url/{param1}/{param2}');
   *   fn({ param1: 123, param2: 456 }); // => 'some/url/123/456'
   */
  makeURLInterpolator: (() => {
    const rc = {
      "\n": "\\n",
      '"': '\\"',
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    return str => {
      const cleanString = str.replace(/["\n\r\u2028\u2029]/g, $0 => rc[$0]);
      return outputs => {
        return cleanString.replace(/\{([\s\S]+?)\}/g, ($0, $1) =>
          encodeURIComponent(outputs[$1] || "")
        );
      };
    };
  })()
};

module.exports = utils;
