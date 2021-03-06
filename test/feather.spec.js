"use strict";

const testUtils = require("./testUtils.js");
const utils = require("../src/utils.js");
const Feather = require("../src/feather");
const feather = require("../src/feather")(testUtils.getFeatherApiKey(), {
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
});

// * * * * * Credentials * * * * * //

const sampleCredetialRequiresVerificationCode = {
  id: "CRD_fd881d84-537f-455c-a086-9508b917cd8c",
  object: "credential",
  created_at: "2020-01-01T15:44:00.939855294Z",
  expires_at: "2020-01-01T15:59:00.939855294Z",
  status: "requires_verification",
  token: null,
  type: "email"
};

const sampleCredentialValid = {
  id: "CRD_fd881d84-537f-455c-a086-9508b917cd8c",
  object: "credential",
  created_at: "2020-01-01T15:44:00.939855294Z",
  expires_at: "2020-01-01T15:59:00.939855294Z",
  status: "valid",
  token: "foo",
  type: "email"
};

describe("feather.credentials.create", function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("should reject invalid input", function() {
    var data = { type: 123 };

    var data = {
      type: "email|password",
      email: 123,
      password: "p4ssw0rd"
    };
    expect(feather.credentials.create(data)).to.be.rejectedWith(
      `expected param 'email' to be of type 'string'`
    );

    var data = {
      type: "email|password",
      email: true,
      password: "p4ssw0rd"
    };
    expect(feather.credentials.create(data)).to.be.rejectedWith(
      `expected param 'email' to be of type 'string'`
    );

    var data = {
      type: "email|password",
      email: {},
      password: "p4ssw0rd"
    };
    expect(feather.credentials.create(data)).to.be.rejectedWith(
      `expected param 'email' to be of type 'string'`
    );

    var data = {
      type: "email|password",
      email: "foo@bar.com",
      password: 123
    };
    expect(feather.credentials.create(data)).to.be.rejectedWith(
      `expected param 'password' to be of type 'string'`
    );

    var data = {
      type: "email|password",
      email: "foo@bar.com",
      password: true
    };
    expect(feather.credentials.create(data)).to.be.rejectedWith(
      `expected param 'password' to be of type 'string'`
    );

    var data = {
      type: "email|password",
      email: "foo@bar.com",
      password: {}
    };
    expect(feather.credentials.create(data)).to.be.rejectedWith(
      `expected param 'password' to be of type 'string'`
    );
  });

  it("should create a credential", function() {
    const scope = nock("http://localhost:8080", {
      reqHeaders: {
        Authorization: "Basic dGVzdF9sYUNaR1lmYURSZU5td2tsWnNmSXJUc0ZhNW5WaDk6",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .post(
        "/v1/credentials",
        "email=foo%40test.com&password=bar&scopes=upgrade_session"
      )
      .times(1)
      .reply(200, sampleCredentialValid);
    const data = {
      email: "foo@test.com",
      password: "bar",
      scopes: "upgrade_session"
    };
    return expect(feather.credentials.create(data)).to.eventually.deep.equal(
      utils.snakeToCamelCase(sampleCredentialValid)
    );
  });

  it("should reject a gateway error", function() {
    const scope = nock("http://localhost:8080")
      .post("/v1/credentials")
      .replyWithError("boom");
    const data = {
      email: "foo@test.com",
      password: "bar",
      scopes: "upgrade_session"
    };
    return expect(feather.credentials.create(data)).to.be.rejectedWith("boom");
  });
});

describe("feather.credentials.update", function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("should reject invalid input", function() {
    var data = { verification_code: "foo" };
    expect(feather.credentials.update(123, data)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.credentials.update(true, data)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.credentials.update({}, data)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    var data = { verificationCode: 123 };
    expect(feather.credentials.update("CRD_foo", data)).to.be.rejectedWith(
      `expected param 'verificationCode' to be of type 'string'`
    );

    var data = { verificationCode: true };
    expect(feather.credentials.update("CRD_foo", data)).to.be.rejectedWith(
      `expected param 'verificationCode' to be of type 'string'`
    );

    var data = { verificationCode: {} };
    expect(feather.credentials.update("CRD_foo", data)).to.be.rejectedWith(
      `expected param 'verificationCode' to be of type 'string'`
    );
  });

  it("should update a credential", function() {
    const scope = nock("http://localhost:8080", {
      reqHeaders: {
        Authorization: "Basic dGVzdF9sYUNaR1lmYURSZU5td2tsWnNmSXJUc0ZhNW5WaDk6",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .post("/v1/credentials/CRD_foo", "verification_code=foo")
      .times(1)
      .reply(200, sampleCredentialValid);
    const data = { verificationCode: "foo" };
    return expect(
      feather.credentials.update("CRD_foo", data)
    ).to.eventually.deep.equal(utils.snakeToCamelCase(sampleCredentialValid));
  });

  it("should reject a gateway error", function() {
    const scope = nock("http://localhost:8080")
      .post("/v1/credentials/CRD_foo")
      .replyWithError("boom");
    const data = { verificationCode: "foo" };
    return expect(
      feather.credentials.update("CRD_foo", data)
    ).to.be.rejectedWith("boom");
  });
});

// * * * * * Passwords * * * * * //

const samplePassword = {
  object: "password",
  created_at: "2020-01-01T15:44:00.939855294Z"
};

describe("feather.passwords.create", function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("should reject invalid input", function() {
    expect(feather.passwords.create(true, "foo")).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.passwords.create(123, "foo")).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.passwords.create({}, "foo")).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.passwords.create(null, "foo")).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );
  });

  it("should create a password", function() {
    const scope = nock("http://localhost:8080", {
      reqHeaders: {
        Authorization: "Basic dGVzdF9sYUNaR1lmYURSZU5td2tsWnNmSXJUc0ZhNW5WaDk6",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Credential-Token": "foo"
      }
    })
      .post("/v1/passwords", "password=n3w_p4ssw0rd")
      .times(1)
      .reply(200, samplePassword);
    return expect(
      feather.passwords.create("n3w_p4ssw0rd", "foo")
    ).to.eventually.deep.equal(utils.snakeToCamelCase(samplePassword));
  });

  it("should reject a gateway error", function() {
    const scope = nock("http://localhost:8080")
      .post("/v1/passwords")
      .replyWithError("boom");
    return expect(
      feather.passwords.create("n3w_p4ssw0rd", "foo")
    ).to.be.rejectedWith("boom");
  });
});

// * * * * * Users * * * * * //

const sampleUserAnonymous = {
  id: "USR_e4e9bc4c-19c8-4da9-9eb3-4553d4bd37a6",
  object: "user",
  email: null,
  is_email_verified: false,
  is_anonymous: true,
  metadata: `{}`,
  created_at: "2020-05-13T19:41:45.566791Z",
  updated_at: "2020-05-13T19:41:45.566791Z"
};

const sampleUserAuthenticated = {
  id: "USR_e2969a70-bcde-4e63-a1b6-e479a0c20fb4",
  object: "user",
  email: "foo@bar.com",
  is_email_verified: false,
  is_anonymous: false,
  metadata: `{"highScore": "123"}`,
  created_at: "2020-05-13T19:41:45.566791Z",
  updated_at: "2020-05-13T19:41:45.566791Z"
};

const sampleUserList = {
  type: "list",
  data: [sampleUserAnonymous, sampleUserAuthenticated]
};

describe("feather.users.create", function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("should reject invalid input", function() {
    expect(feather.users.create(true)).to.be.rejectedWith(
      `expected param 'credentialToken' to be of type 'string'`
    );

    expect(feather.users.create(123)).to.be.rejectedWith(
      `expected param 'credentialToken' to be of type 'string'`
    );

    expect(feather.users.create({})).to.be.rejectedWith(
      `expected param 'credentialToken' to be of type 'string'`
    );
  });

  it("should create an anonymous user", function() {
    const scope = nock("http://localhost:8080", {
      reqHeaders: {
        Authorization: "Basic dGVzdF9sYUNaR1lmYURSZU5td2tsWnNmSXJUc0ZhNW5WaDk6",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .post("/v1/users")
      .times(1)
      .reply(200, sampleUserAnonymous);
    return expect(feather.users.create()).to.eventually.deep.equal(
      utils.snakeToCamelCase(sampleUserAnonymous)
    );
  });

  it("should create an authenticated user", function() {
    const scope = nock("http://localhost:8080", {
      reqHeaders: {
        Authorization: "Basic dGVzdF9sYUNaR1lmYURSZU5td2tsWnNmSXJUc0ZhNW5WaDk6",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Credential-Token": "foo"
      }
    })
      .post("/v1/users")
      .times(1)
      .reply(200, sampleUserAuthenticated);
    return expect(feather.users.create("foo")).to.eventually.deep.equal(
      utils.snakeToCamelCase(sampleUserAuthenticated)
    );
  });

  it("should reject a gateway error", function() {
    const scope = nock("http://localhost:8080")
      .post("/v1/users", {})
      .replyWithError("boom");
    return expect(feather.users.create("foo")).to.be.rejectedWith("boom");
  });
});

describe("feather.users.list", function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("should reject invalid input", function() {
    expect(feather.users.list({ limit: "foo" })).to.be.rejectedWith(
      `expected param 'limit' to be of type 'number'`
    );

    expect(feather.users.list({ limit: true })).to.be.rejectedWith(
      `expected param 'limit' to be of type 'number'`
    );

    expect(feather.users.list({ limit: {} })).to.be.rejectedWith(
      `expected param 'limit' to be of type 'number'`
    );
  });

  it("should list users", function() {
    const scope = nock("http://localhost:8080", {
      reqHeaders: {
        Authorization: "Basic dGVzdF9sYUNaR1lmYURSZU5td2tsWnNmSXJUc0ZhNW5WaDk6",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .get("/v1/users?limit=25&starting_after=USR_foo", {})
      .times(1)
      .reply(200, sampleUserList);
    return expect(
      feather.users.list({ limit: 25, startingAfter: "USR_foo" })
    ).to.eventually.deep.equal(utils.snakeToCamelCase(sampleUserList));
  });

  it("should reject a gateway error", function() {
    const scope = nock("http://localhost:8080")
      .get("/v1/users?limit=25", {})
      .replyWithError("boom");
    return expect(feather.users.list({ limit: 25 })).to.be.rejectedWith("boom");
  });
});

describe("feather.users.retrieve", function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("should reject invalid input", function() {
    expect(feather.users.retrieve(true)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.retrieve(123)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.retrieve({})).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.retrieve(null)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );
  });

  it("should retrieve a user", function() {
    const scope = nock("http://localhost:8080", {
      reqHeaders: {
        Authorization: "Basic dGVzdF9sYUNaR1lmYURSZU5td2tsWnNmSXJUc0ZhNW5WaDk6",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .get("/v1/users/USR_foo", {})
      .times(1)
      .reply(200, sampleUserAnonymous);
    return expect(feather.users.retrieve("USR_foo")).to.eventually.deep.equal(
      utils.snakeToCamelCase(sampleUserAnonymous)
    );
  });

  it("should reject a gateway error", function() {
    const scope = nock("http://localhost:8080")
      .get("/v1/users/USR_foo", {})
      .replyWithError("boom");
    return expect(feather.users.retrieve("USR_foo")).to.be.rejectedWith("boom");
  });
});

describe("feather.users.update", function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("should reject invalid input", function() {
    var data = {};
    expect(feather.users.update(true, data)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    var data = {};
    expect(feather.users.update(123, data)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    var data = {};
    expect(feather.users.update({}, data)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    var data = {};
    expect(feather.users.update(null, data)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    var data = { metadata: true };
    expect(feather.users.update("USR_foo", data)).to.be.rejectedWith(
      `expected param 'metadata' to be of type 'object'`
    );
    var data = { metadata: 123 };
    expect(feather.users.update("USR_foo", data)).to.be.rejectedWith(
      `expected param 'metadata' to be of type 'object'`
    );
    var data = { metadata: "foo" };
    expect(feather.users.update("USR_foo", data)).to.be.rejectedWith(
      `expected param 'metadata' to be of type 'object'`
    );
  });

  it("should update a user", function() {
    const scope = nock("http://localhost:8080", {
      reqHeaders: {
        Authorization: "Basic dGVzdF9sYUNaR1lmYURSZU5td2tsWnNmSXJUc0ZhNW5WaDk6",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .post("/v1/users/USR_foo", "metadata%5BhighScore%5D=101")
      .times(1)
      .reply(200, sampleUserAuthenticated);
    const data = {
      metadata: { highScore: 101 }
    };
    return expect(
      feather.users.update("USR_foo", data)
    ).to.eventually.deep.equal(utils.snakeToCamelCase(sampleUserAuthenticated));
  });

  it("should reject a gateway error", function() {
    const scope = nock("http://localhost:8080")
      .post("/v1/users/USR_foo")
      .replyWithError("boom");
    const data = {
      username: "foo",
      email: "foo@bar.com",
      metadata: { highScore: 101 }
    };
    return expect(feather.users.update("USR_foo", data)).to.be.rejectedWith(
      "boom"
    );
  });
});

describe("feather.users.updateEmail", function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("should reject invalid input", function() {
    expect(
      feather.users.updateEmail(true, "foo@bar.com", "foo")
    ).to.be.rejectedWith(`expected param 'id' to be of type 'string'`);

    expect(
      feather.users.updateEmail(123, "foo@bar.com", "foo")
    ).to.be.rejectedWith(`expected param 'id' to be of type 'string'`);

    expect(
      feather.users.updateEmail({}, "foo@bar.com", "foo")
    ).to.be.rejectedWith(`expected param 'id' to be of type 'string'`);

    expect(
      feather.users.updateEmail(null, "foo@bar.com", "foo")
    ).to.be.rejectedWith(`expected param 'id' to be of type 'string'`);

    expect(
      feather.users.updateEmail("USR_foo", "foo@bar.com", null)
    ).to.be.rejectedWith(
      `expected param 'credentialToken' to be of type 'string'`
    );

    expect(
      feather.users.updateEmail("USR_foo", "foo@bar.com", 123)
    ).to.be.rejectedWith(
      `expected param 'credentialToken' to be of type 'string'`
    );

    expect(
      feather.users.updateEmail("USR_foo", "foo@bar.com", {})
    ).to.be.rejectedWith(
      `expected param 'credentialToken' to be of type 'string'`
    );

    expect(
      feather.users.updateEmail("USR_foo", "foo@bar.com", true)
    ).to.be.rejectedWith(
      `expected param 'credentialToken' to be of type 'string'`
    );

    expect(
      feather.users.updateEmail("USR_foo", null, "foo")
    ).to.be.rejectedWith(`expected param 'newEmail' to be of type 'string'`);

    expect(
      feather.users.updateEmail("USR_foo", true, "foo")
    ).to.be.rejectedWith(`expected param 'newEmail' to be of type 'string'`);

    expect(feather.users.updateEmail("USR_foo", 123, "foo")).to.be.rejectedWith(
      `expected param 'newEmail' to be of type 'string'`
    );

    expect(feather.users.updateEmail("USR_foo", {}, "foo")).to.be.rejectedWith(
      `expected param 'newEmail' to be of type 'string'`
    );
  });

  it("should update a user's email", function() {
    const scope = nock("http://localhost:8080", {
      reqHeaders: {
        Authorization: "Basic dGVzdF9sYUNaR1lmYURSZU5td2tsWnNmSXJUc0ZhNW5WaDk6",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Credential-Token": "foo"
      }
    })
      .post("/v1/users/USR_foo/email", "new_email=foo%40bar.com")
      .times(1)
      .reply(200, sampleUserAuthenticated);
    return expect(
      feather.users.updateEmail("USR_foo", "foo@bar.com", "foo")
    ).to.eventually.deep.equal(utils.snakeToCamelCase(sampleUserAuthenticated));
  });

  it("should reject a gateway error", function() {
    const scope = nock("http://localhost:8080")
      .post("/v1/users/USR_foo/email")
      .replyWithError("boom");
    return expect(
      feather.users.updateEmail("USR_foo", "foo@bar.com", "foo")
    ).to.be.rejectedWith("boom");
  });
});

describe("feather.users.refreshTokens", function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("should reject invalid input", function() {
    expect(feather.users.refreshTokens(true, "foo")).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.refreshTokens(123, "foo")).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.refreshTokens({}, "foo")).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.refreshTokens(null, "foo")).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.refreshTokens("foo", true)).to.be.rejectedWith(
      `expected param 'refreshToken' to be of type 'string'`
    );

    expect(feather.users.refreshTokens("foo", 123)).to.be.rejectedWith(
      `expected param 'refreshToken' to be of type 'string'`
    );

    expect(feather.users.refreshTokens("foo", {})).to.be.rejectedWith(
      `expected param 'refreshToken' to be of type 'string'`
    );

    expect(feather.users.refreshTokens("foo", null)).to.be.rejectedWith(
      `expected param 'refreshToken' to be of type 'string'`
    );
  });

  it("should refresh a user's tokens", function() {
    const scope = nock("http://localhost:8080", {
      reqHeaders: {
        Authorization: "Basic dGVzdF9sYUNaR1lmYURSZU5td2tsWnNmSXJUc0ZhNW5WaDk6",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Refresh-Token": "foo"
      }
    })
      .post("/v1/users/USR_foo/tokens", {})
      .times(1)
      .reply(200, sampleUserAuthenticated);
    return expect(
      feather.users.refreshTokens("USR_foo", "foo")
    ).to.eventually.deep.equal(utils.snakeToCamelCase(sampleUserAuthenticated));
  });

  it("should reject a gateway error", function() {
    const scope = nock("http://localhost:8080")
      .post("/v1/users/USR_foo/tokens")
      .replyWithError("boom");
    return expect(
      feather.users.refreshTokens("USR_foo", "foo")
    ).to.be.rejectedWith("boom");
  });
});

describe("feather.users.revokeTokens", function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("should reject invalid input", function() {
    expect(feather.users.revokeTokens(true, "foo")).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.revokeTokens(123, "foo")).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.revokeTokens({}, "foo")).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.revokeTokens(null, "foo")).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.revokeTokens("foo", true)).to.be.rejectedWith(
      `expected param 'refreshToken' to be of type 'string'`
    );

    expect(feather.users.revokeTokens("foo", 123)).to.be.rejectedWith(
      `expected param 'refreshToken' to be of type 'string'`
    );

    expect(feather.users.revokeTokens("foo", {})).to.be.rejectedWith(
      `expected param 'refreshToken' to be of type 'string'`
    );

    expect(feather.users.revokeTokens("foo", null)).to.be.rejectedWith(
      `expected param 'refreshToken' to be of type 'string'`
    );
  });

  it("should revoke a user's tokens", function() {
    const scope = nock("http://localhost:8080", {
      reqHeaders: {
        Authorization: "Basic dGVzdF9sYUNaR1lmYURSZU5td2tsWnNmSXJUc0ZhNW5WaDk6",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Refresh-Token": "foo"
      }
    })
      .delete("/v1/users/USR_foo/tokens", {})
      .times(1)
      .reply(200, sampleUserAuthenticated);
    return expect(
      feather.users.revokeTokens("USR_foo", "foo")
    ).to.eventually.deep.equal(utils.snakeToCamelCase(sampleUserAuthenticated));
  });

  it("should reject a gateway error", function() {
    const scope = nock("http://localhost:8080")
      .delete("/v1/users/USR_foo/tokens")
      .replyWithError("boom");
    return expect(
      feather.users.revokeTokens("USR_foo", "foo")
    ).to.be.rejectedWith("boom");
  });
});

// * * * * * Gateway * * * * * //

describe("feather._gateway", function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  afterEach(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("should reject unparsable response", function() {
    const scope = nock("http://localhost:8080")
      .get("/v1/users/USR_foo", {})
      .reply(200, "!@#$%^");
    return expect(feather.users.retrieve("USR_foo")).to.be.rejectedWith(
      "The gateway received an unparsable response with status code 200"
    );
  });
});
