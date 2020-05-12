const utils = {
  /**
   * Get a Feather API key for testing
   */
  getFeatherApiKey: () => {
    const key =
      process.env.FEATHER_TEST_API_KEY || "test_laCZGYfaDReNmwklZsfIrTsFa5nVh9";
    return key;
  }
};

module.exports = utils;
