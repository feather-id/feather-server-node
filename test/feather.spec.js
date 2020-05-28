"use strict";

const testUtils = require("../testUtils");
const Feather = require("../lib/feather");
const feather = require("../lib/feather")(testUtils.getFeatherApiKey(), {
  protocol: "http",
  host: "localhost",
  port: "8080"
});

const nock = require("nock");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

// * * * * * Constructor * * * * * //

describe("feather constructor", function() {
  it("should only accept an api key of type string", function() {
    expect(() => {
      Feather(true);
    }).to.throw(`expected 'apiKey' to be of type 'string'`);

    expect(() => {
      Feather(123);
    }).to.throw(`expected 'apiKey' to be of type 'string'`);

    expect(() => {
      Feather({});
    }).to.throw(`expected 'apiKey' to be of type 'string'`);

    expect(() => {
      Feather(null);
    }).to.throw(`expected 'apiKey' to be of type 'string'`);

    expect(() => {
      Feather("test_123");
    }).to.not.throw();
  });

  it("should throw error if config is not an object", () => {
    expect(() => {
      Feather(testUtils.getFeatherApiKey(), true);
    }).to.throw(`expected 'config' to be of type 'object'`);

    expect(() => {
      Feather(testUtils.getFeatherApiKey(), 123);
    }).to.throw(`expected 'config' to be of type 'object'`);

    expect(() => {
      Feather(testUtils.getFeatherApiKey(), "test_123");
    }).to.throw(`expected 'config' to be of type 'object'`);

    expect(() => {
      Feather(testUtils.getFeatherApiKey(), null);
    }).to.not.throw();

    expect(() => {
      Feather(testUtils.getFeatherApiKey(), {});
    }).to.not.throw();
  });

  it("should only accept a config with allowed properties", () => {
    expect(() => {
      Feather(testUtils.getFeatherApiKey(), {
        foo: "bar",
        baz: "qux"
      });
    }).to.throw(
      `'config' contained the following unknown attributes: foo, baz`
    );

    expect(() => {
      Feather(testUtils.getFeatherApiKey(), {
        host: "foo.feather.id",
        port: 321
      });
    }).to.not.throw();
  });

  it("should only accept a valid protocol", () => {
    expect(() => {
      Feather(testUtils.getFeatherApiKey(), {
        protocol: "foo"
      });
    }).to.throw(`expected 'protocol' to be one of either: 'http' or 'https'`);

    expect(() => {
      Feather(testUtils.getFeatherApiKey(), {
        protocol: "http"
      });
    }).to.not.throw();
  });

  it("should create a gateway", () => {
    expect(() => {
      return Feather(testUtils.getFeatherApiKey(), {})._gateway;
    }).to.not.be.null;
  });
});

// * * * * * Sessions * * * * * //

const sampleSession = {
  id: "SES_82d099a8-f06d-490d-b68b-8a4546842bf1",
  object: "session",
  status: "active",
  token: "foo",
  user_id: "USR_e4e9bc4c-19c8-4da9-9eb3-4553d4bd37a6",
  created_at: "2020-01-01T15:40:40.61536699Z",
  revoked_at: null
};

const sampleSessionRevoked = {
  id: "SES_82d099a8-f06d-490d-b68b-8a4546842bf1",
  object: "session",
  status: "revoked",
  token: "foo",
  user_id: "USR_e4e9bc4c-19c8-4da9-9eb3-4553d4bd37a6",
  created_at: "2020-01-01T15:40:40.61536699Z",
  revoked_at: "2020-01-01T16:40:40.61536699Z"
};

const sampleSessionList = {
  object: "list",
  has_more: false,
  url: "/v1/sessions",
  data: [sampleSession, sampleSessionRevoked]
};

describe("feather.sessions.validate", function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("should reject invalid input", function() {
    var data = { session_token: "foo" };
    expect(feather.sessions.validate(data)).to.be.rejectedWith(
      "The session token is invalid"
    );

    var data = { session_token: 123 };
    expect(feather.sessions.validate(data)).to.be.rejectedWith(
      `expected param 'session_token' to be of type 'string'`
    );

    var data = { session_token: true };
    expect(feather.sessions.validate(data)).to.be.rejectedWith(
      `expected param 'session_token' to be of type 'string'`
    );

    var data = { session_token: {} };
    expect(feather.sessions.validate(data)).to.be.rejectedWith(
      `expected param 'session_token' to be of type 'string'`
    );

    var data = { session_token: null };
    expect(feather.sessions.validate(data)).to.be.rejectedWith(
      `required param not provided: 'session_token'`
    );
  });

  it("should parse a valid token", function() {
    const data = {
      session_token: testUtils.getSampleSessionTokens()["validButStale"]
    };
    const scope = testUtils
      .getPublicKeyNock()
      .post(
        "/v1/sessions/SES_10836cb6-994d-40f6-950c-3617be17b7c3/validate",
        data
      )
      .times(1)
      .reply(200, sampleSession);
    return feather.sessions.validate(data).then(res => {
      expect(res).to.deep.equal(sampleSession);
      expect(scope.isDone()).to.equal(true);
    });
  });

  it("should reject an invalid signature algorithm", function() {
    const scope = testUtils.getPublicKeyNock();
    const data = {
      session_token: testUtils.getSampleSessionTokens()["invalidAlg"]
    };
    return expect(feather.sessions.validate(data)).to.be.rejectedWith(
      "The session token is invalid"
    );
  });

  it("should reject an invalid signature", function() {
    const scope = testUtils.getPublicKeyNock();
    const data = {
      session_token: testUtils.getSampleSessionTokens()["invalidSignature"]
    };
    return expect(feather.sessions.validate(data)).to.be.rejectedWith(
      "The session token is invalid"
    );
  });

  it("should reject a modified token", function() {
    const scope = testUtils.getPublicKeyNock();
    const data = {
      session_token: testUtils.getSampleSessionTokens()["modified"]
    };
    return expect(feather.sessions.validate(data)).to.be.rejectedWith(
      "The session token is invalid"
    );
  });

  it("should reject a missing key id", function() {
    const scope = testUtils.getPublicKeyNock();
    const data = {
      session_token: testUtils.getSampleSessionTokens()["missingKeyId"]
    };
    return expect(feather.sessions.validate(data)).to.be.rejectedWith(
      "The session token is invalid"
    );
  });

  it("should reject an invalid issuer", function() {
    const scope = testUtils.getPublicKeyNock();
    const data = {
      session_token: testUtils.getSampleSessionTokens()["invalidIssuer"]
    };
    return expect(feather.sessions.validate(data)).to.be.rejectedWith(
      "The session token is invalid"
    );
  });

  it("should reject an invalid subject", function() {
    const scope = testUtils.getPublicKeyNock();
    const data = {
      session_token: testUtils.getSampleSessionTokens()["invalidSubject"]
    };
    return expect(feather.sessions.validate(data)).to.be.rejectedWith(
      "The session token is invalid"
    );
  });

  it("should reject an invalid audience", function() {
    const scope = testUtils.getPublicKeyNock();
    const data = {
      session_token: testUtils.getSampleSessionTokens()["invalidAudience"]
    };
    return expect(feather.sessions.validate(data)).to.be.rejectedWith(
      "The session token is invalid"
    );
  });

  it("should reject an invalid session id", function() {
    const scope = testUtils.getPublicKeyNock();
    const data = {
      session_token: testUtils.getSampleSessionTokens()["invalidSessionId"]
    };
    return expect(feather.sessions.validate(data)).to.be.rejectedWith(
      "The session token is invalid"
    );
  });
});
