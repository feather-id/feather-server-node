"use strict";

const testUtils = require("../../testUtils");
var feather = testUtils.getSpyableFeather();
const credentialTypes = require("../../lib/credentialTypes");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const sampleReponse_requiresOneTimeCode = {
  id: "CRD_fd881d84-537f-455c-a086-9508b917cd8c",
  object: "credential",
  created_at: "2020-01-01T15:44:00.939855294Z",
  expires_at: "2020-01-01T15:59:00.939855294Z",
  status: "requires_one_time_code",
  token: null,
  type: "email"
};

const sampleReponse_valid = {
  id: "CRD_fd881d84-537f-455c-a086-9508b917cd8c",
  object: "credential",
  created_at: "2020-01-01T15:44:00.939855294Z",
  expires_at: "2020-01-01T15:59:00.939855294Z",
  status: "valid",
  token: "foo",
  type: "email"
};

describe("credentials resource", function() {
  before(function() {
    feather.credentials._feather = feather;
  });

  it("[create] should create a credential", function() {
    feather._gateway.mockResponse = sampleReponse_requiresOneTimeCode;
    feather.credentials
      .create("email", "foo@bar.com", "baz", "quz")
      .then(res => {
        expect(feather._gateway.LAST_REQUEST).to.deep.equal({
          method: "POST",
          path: "/credentials",
          data: {
            type: "email",
            email: "foo@bar.com",
            username: "baz",
            password: "quz"
          }
        });
      });
  });

  it("[create] should throw error if type is not a string", function() {
    expect(
      feather.credentials.create(true, "foo", "bar", "baz")
    ).to.be.rejectedWith(/Type must be a string/);

    expect(
      feather.credentials.create(123, "foo", "bar", "baz")
    ).to.be.rejectedWith(/Type must be a string/);

    expect(
      feather.credentials.create({}, "foo", "bar", "baz")
    ).to.be.rejectedWith(/Type must be a string/);

    expect(
      feather.credentials.create(null, "foo", "bar", "baz")
    ).to.be.rejectedWith(/Type must be a string/);
  });

  it("[create] should throw error if type is invalid", function() {
    expect(
      feather.credentials.create("foo", null, null, null)
    ).to.be.rejectedWith(/Invalid credential type: foo/);
  });

  it("[create] should throw error if email is not a string", function() {
    expect(
      feather.credentials.create(credentialTypes.EMAIL, true, "bar", "baz")
    ).to.be.rejectedWith(/Email must be a string/);

    expect(
      feather.credentials.create(credentialTypes.EMAIL, 123, "bar", "baz")
    ).to.be.rejectedWith(/Email must be a string/);

    expect(
      feather.credentials.create(credentialTypes.EMAIL, {}, "bar", "baz")
    ).to.be.rejectedWith(/Email must be a string/);
  });

  it("[create] should throw error if username is not a string", function() {
    expect(
      feather.credentials.create(
        credentialTypes.USERNAME_PASSWORD,
        "bar",
        true,
        "baz"
      )
    ).to.be.rejectedWith(/Username must be a string/);

    expect(
      feather.credentials.create(
        credentialTypes.USERNAME_PASSWORD,
        "bar",
        123,
        "baz"
      )
    ).to.be.rejectedWith(/Username must be a string/);

    expect(
      feather.credentials.create(
        credentialTypes.USERNAME_PASSWORD,
        "bar",
        {},
        "baz"
      )
    ).to.be.rejectedWith(/Username must be a string/);
  });

  it("[create] should throw error if password is not a string", function() {
    expect(
      feather.credentials.create(
        credentialTypes.EMAIL_PASSWORD,
        "bar",
        "baz",
        true
      )
    ).to.be.rejectedWith(/Password must be a string/);

    expect(
      feather.credentials.create(
        credentialTypes.EMAIL_PASSWORD,
        "bar",
        "baz",
        123
      )
    ).to.be.rejectedWith(/Password must be a string/);

    expect(
      feather.credentials.create(
        credentialTypes.EMAIL_PASSWORD,
        "bar",
        "baz",
        {}
      )
    ).to.be.rejectedWith(/Password must be a string/);
  });

  it("[update] should update a credential", function() {
    feather._gateway.mockResponse = sampleReponse_valid;
    feather.credentials.update("foo", "bar").then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "POST",
        path: "/credentials/foo",
        data: {
          one_time_code: "bar"
        }
      });
    });
  });

  it("[update] should throw error if ID is not a string", function() {
    expect(feather.credentials.update(true, "foo")).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.credentials.update(123, "foo")).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.credentials.update({}, "foo")).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.credentials.update(null, "foo")).to.be.rejectedWith(
      /ID must be a string/
    );
  });

  it("[update] should throw error if oneTimeCode is not a string", function() {
    expect(feather.credentials.update("foo", true)).to.be.rejectedWith(
      /OneTimeCode must be a string/
    );

    expect(feather.credentials.update("foo", 123)).to.be.rejectedWith(
      /OneTimeCode must be a string/
    );

    expect(feather.credentials.update("foo", {})).to.be.rejectedWith(
      /OneTimeCode must be a string/
    );

    expect(feather.credentials.update("foo", null)).to.be.rejectedWith(
      /OneTimeCode must be a string/
    );
  });
});
