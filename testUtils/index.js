const utils = {
  /**
   * Get a Feather API key for testing
   */
  getFeatherApiKey: () => {
    const key =
      process.env.FEATHER_TEST_API_KEY || "test_laCZGYfaDReNmwklZsfIrTsFa5nVh9";
    return key;
  },

  getSpyableFeather: () => {
    const feather = require("../lib/feather")("fake_api_key");

    function getMockGateway() {
      const gateway = require("../lib/gateway");
      const mockGateway = new gateway("fake_api_key", {});
      mockGateway.sendRequest = (method, path, data) => {
        mockGateway.LAST_REQUEST = {
          method: method,
          path: path,
          data: data
        };
        return;
      };
      return mockGateway;
    }

    feather._gateway = getMockGateway();
    return feather;
  }
};

module.exports = utils;
