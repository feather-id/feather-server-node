"use strict";

const testUtils = require("../testUtils");
const parseToken = require("../lib/parseToken");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const mockPublicKeys = {
  retrieve: id => {
    return new Promise(function(resolve, reject) {
      resolve(testUtils.getFakePublicKey());
    });
  }
};

describe("parseToken", function() {
  it("should reject an invalid JWT", function() {
    expect(parseToken("foo", null)).to.be.rejectedWith(
      "Token has an invalid format"
    );

    expect(parseToken(123, null)).to.be.rejectedWith(
      "Token has an invalid format"
    );

    expect(parseToken(true, null)).to.be.rejectedWith(
      "Token has an invalid format"
    );

    expect(parseToken({}, null)).to.be.rejectedWith(
      "Token has an invalid format"
    );

    expect(parseToken(null, null)).to.be.rejectedWith(
      "Token has an invalid format"
    );
  });

  it("should parse a valid token", function() {
    const token = testUtils.getSampleSessionTokens()["validButStale"];
    return expect(parseToken(token, mockPublicKeys)).to.eventually.deep.equal({
      id: "SES_10836cb6-994d-40f6-950c-3617be17b7c3",
      object: "session",
      type: "authenticated",
      status: "stale",
      token:
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IjAiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJQUkpfY2RiY2M5ODYtYWU2Ni00NjY2LWI5NDYtMTgyNmNmMGIyYjU3IiwiY2F0IjoxNTg5Mzc3Mzk0LCJleHAiOjE1ODkzNzc5OTQsImlhdCI6MTU4OTM3NzM5NCwiaXNzIjoiZmVhdGhlci5pZCIsImp0aSI6IlVDc3pybnFTeGhzNkZmeDUwdFp6ZHVwTmpsWmZQM1VrZzI3VUZvVHhReVlwa0hZN2VtMFZndEtSTDNQempReXpia3JoNGVONDl0WlRTS1dJaVowN05UQlJoSHY1Y25JeXNPSzciLCJyYXQiOm51bGwsInNlcyI6IlNFU18xMDgzNmNiNi05OTRkLTQwZjYtOTUwYy0zNjE3YmUxN2I3YzMiLCJzdWIiOiJVU1JfYTY4NzViMzQtNDZlYS00MjlkLTg1OGMtM2FhNmEzNDNiNTM0IiwidHlwIjoiYXV0aGVudGljYXRlZCJ9.wgXjg4eY6ziujbGpOuwFyNB9hQrQSFd98Ey4gMhVarZK3OmdXbB0QqDahg1ON6Ebzr_oydjTyk1yD-eJ-5Rf5YwIvl7tC9fTPDkH2rYSIH6qfi0a5k-8-Km8E4x7TY4YPybdMmA4ycJUXvyPEl7N2awHb1YduCpDptUR9A2y_ASzyK4Lw01EdazEjho0OW2sJ7BjInirRbLuK1dKvrUicI8Sj-glr9WRlD1XF0zBeOTcwIa7sMieBrkCUtzPb1QWWTXbExmtGyDr0lyGX_dXdZGO_Q53PRI7m01HxNzrCf1GF_zXoKogg6iQnpbXopSTp51hwe5m-QYBPd0IT2YTsw",
      userId: "USR_a6875b34-46ea-429d-858c-3aa6a343b534",
      createdAt: 1589377394,
      revokedAt: null
    });
  });

  it("should reject an invalid signature algorithm", function() {
    const token = testUtils.getSampleSessionTokens()["invalidAlg"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Invalid signature algorithm"
    );
  });

  it("should reject an invalid signature", function() {
    const token = testUtils.getSampleSessionTokens()["invalidSignature"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Invalid signature"
    );
  });

  it("should reject a modified token", function() {
    const token = testUtils.getSampleSessionTokens()["modified"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Token has an invalid format"
    );
  });

  it("should reject a missing key id", function() {
    const token = testUtils.getSampleSessionTokens()["missingKeyId"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Invalid key ID"
    );
  });

  it("should reject an invalid token id", function() {
    const token = testUtils.getSampleSessionTokens()["invalidTokenId"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Invalid claim: jti"
    );
  });

  it("should reject an invalid issuer", function() {
    const token = testUtils.getSampleSessionTokens()["invalidIssuer"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Invalid claim: iss"
    );
  });

  it("should reject an invalid subject", function() {
    const token = testUtils.getSampleSessionTokens()["invalidSubject"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Invalid claim: sub"
    );
  });

  it("should reject an invalid audience", function() {
    const token = testUtils.getSampleSessionTokens()["invalidAudience"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Invalid claim: aud"
    );
  });

  it("should reject an invalid session id", function() {
    const token = testUtils.getSampleSessionTokens()["invalidSessionId"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Invalid claim: ses"
    );
  });

  it("should reject an invalid session type", function() {
    const token = testUtils.getSampleSessionTokens()["invalidType"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Invalid claim: typ"
    );
  });

  it("should reject an invalid issued at", function() {
    const token = testUtils.getSampleSessionTokens()["invalidIssueAt"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Invalid claim: iat"
    );
  });

  it("should reject an invalid session created at", function() {
    const token = testUtils.getSampleSessionTokens()["invalidCreatedAt"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Invalid claim: cat"
    );
  });

  it("should reject an invalid session expires at", function() {
    const token = testUtils.getSampleSessionTokens()["invalidExpiresAt"];
    return expect(parseToken(token, mockPublicKeys)).to.be.rejectedWith(
      "Invalid claim: exp"
    );
  });

  it("should reject parsing errors", function() {
    const token = testUtils.getSampleSessionTokens()["validButStale"];
    const buggyPublicKeys = {
      retrieve: id => {
        return new Promise(function(resolve, reject) {
          reject(new Error("boom"));
        });
      }
    };
    expect(parseToken(token, buggyPublicKeys)).to.be.rejectedWith("boom");
  });
});
