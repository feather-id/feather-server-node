const utils = {
  /**
   * Get a Feather API key for testing
   */
  getFeatherApiKey: () => {
    const key =
      process.env.FEATHER_TEST_API_KEY || "test_laCZGYfaDReNmwklZsfIrTsFa5nVh9";
    return key;
  },

  /**
   * Get a Feather instance which can inspect outgoing gateway requests
   */
  getSpyableFeather: () => {
    const feather = require("../lib/feather")("fake_api_key");

    function getMockGateway() {
      const gateway = require("../lib/gateway");
      const mockGateway = new gateway("fake_api_key", {});
      mockGateway.sendRequest = (method, path, data) => {
        return new Promise(function(resolve, reject) {
          mockGateway.LAST_REQUEST = {
            method: method,
            path: path,
            data: data
          };
          resolve();
        });
      };
      return mockGateway;
    }

    feather._gateway = getMockGateway();
    return feather;
  },

  /**
   *
   */
  getSampleSessionToken: () => {
    return `eyJhbGciOiJSUzI1NiIsImtpZCI6IjAiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJQUkpfY2RiY2M5ODYtYWU2Ni00NjY2LWI5NDYtMTgyNmNmMGIyYjU3IiwiY2F0IjoxNTg5Mzc3Mzk0LCJleHAiOjE1ODkzNzc5OTQsImlhdCI6MTU4OTM3NzM5NCwiaXNzIjoiZmVhdGhlci5pZCIsImp0aSI6IlVDc3pybnFTeGhzNkZmeDUwdFp6ZHVwTmpsWmZQM1VrZzI3VUZvVHhReVlwa0hZN2VtMFZndEtSTDNQempReXpia3JoNGVONDl0WlRTS1dJaVowN05UQlJoSHY1Y25JeXNPSzciLCJyYXQiOm51bGwsInNlcyI6IlNFU18xMDgzNmNiNi05OTRkLTQwZjYtOTUwYy0zNjE3YmUxN2I3YzMiLCJzdWIiOiJVU1JfYTY4NzViMzQtNDZlYS00MjlkLTg1OGMtM2FhNmEzNDNiNTM0IiwidHlwIjoiYXV0aGVudGljYXRlZCJ9.wgXjg4eY6ziujbGpOuwFyNB9hQrQSFd98Ey4gMhVarZK3OmdXbB0QqDahg1ON6Ebzr_oydjTyk1yD-eJ-5Rf5YwIvl7tC9fTPDkH2rYSIH6qfi0a5k-8-Km8E4x7TY4YPybdMmA4ycJUXvyPEl7N2awHb1YduCpDptUR9A2y_ASzyK4Lw01EdazEjho0OW2sJ7BjInirRbLuK1dKvrUicI8Sj-glr9WRlD1XF0zBeOTcwIa7sMieBrkCUtzPb1QWWTXbExmtGyDr0lyGX_dXdZGO_Q53PRI7m01HxNzrCf1GF_zXoKogg6iQnpbXopSTp51hwe5m-QYBPd0IT2YTsw`;
  },

  /**
   *
   */
  getFakePublicKey: () => {
    const pem = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAwovomIOamL39k/Q7OfSxRf7ipn0kuQMLfEY0UWHcwq7ubKfjs368
wMcAa7vhlHamZnrONMTtZUNStbhrMBVlzGcSkhSrOENKg+g6KG29WD5VhupKmSGt
hDjQRlx2nvgZSSVdjx8S+BDArPpIWMviViswjRCucWdqFHR6av0v/bvMRYO3qRXK
pGn+LuiDlCi9sgiK72Ayt9unTjodyugchx6Y+RyboKOWZmiLFWRdkMZkvBaxxgaT
S/y1TneJR9eg5EPxh0YQYYEPT3/CYgaw34s/HtqbILWcr4VSG1lrKDQXOneYL+xj
svTcv2z81qX1WN+qhGasUw/dEwjYmbidNwIDAQAB
-----END RSA PUBLIC KEY-----
`;
    return {
      id: "0",
      object: "publicKey",
      pem: pem
    };
  }
};

module.exports = utils;
