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
      .create({
        type: credentialTypes.EMAIL,
        email: "foo@bar.com",
        username: "baz",
        password: "quz"
      })
      .then(res => {
        expect(feather._gateway.LAST_REQUEST).to.deep.equal({
          method: "POST",
          path: "/credentials",
          data: {
            type: credentialTypes.EMAIL,
            email: "foo@bar.com",
            username: "baz",
            password: "quz"
          }
        });
      });
  });

  it("[create] should throw error if type is not a string", function() {
    expect(
      feather.credentials.create({
        type: true,
        email: "foo",
        username: "bar",
        password: "baz"
      })
    ).to.be.rejectedWith(`expected param 'type' to be of type 'string'`);

    expect(
      feather.credentials.create({
        type: 123,
        email: "foo",
        username: "bar",
        password: "baz"
      })
    ).to.be.rejectedWith(`expected param 'type' to be of type 'string'`);

    expect(
      feather.credentials.create({
        type: {},
        email: "foo",
        username: "bar",
        password: "baz"
      })
    ).to.be.rejectedWith(`expected param 'type' to be of type 'string'`);

    expect(
      feather.credentials.create({
        type: null,
        email: "foo",
        username: "bar",
        password: "baz"
      })
    ).to.be.rejectedWith(`required param not provided: 'type'`);
  });

  it("[create] should throw error if email is not a string", function() {
    expect(
      feather.credentials.create({
        type: credentialTypes.EMAIL,
        email: true,
        username: "bar",
        password: "baz"
      })
    ).to.be.rejectedWith(/expected param 'email' to be of type 'string'/);

    expect(
      feather.credentials.create({
        type: credentialTypes.EMAIL,
        email: 123,
        username: "bar",
        password: "baz"
      })
    ).to.be.rejectedWith(/expected param 'email' to be of type 'string'/);

    expect(
      feather.credentials.create({
        type: credentialTypes.EMAIL,
        email: {},
        username: "bar",
        password: "baz"
      })
    ).to.be.rejectedWith(/expected param 'email' to be of type 'string'/);
  });

  it("[create] should throw error if username is not a string", function() {
    expect(
      feather.credentials.create({
        type: credentialTypes.USERNAME_PASSWORD,
        email: "bar",
        username: true,
        password: "baz"
      })
    ).to.be.rejectedWith(`expected param 'username' to be of type 'string'`);

    expect(
      feather.credentials.create({
        type: credentialTypes.USERNAME_PASSWORD,
        email: "bar",
        username: 123,
        password: "baz"
      })
    ).to.be.rejectedWith(`expected param 'username' to be of type 'string'`);

    expect(
      feather.credentials.create({
        type: credentialTypes.USERNAME_PASSWORD,
        email: "bar",
        username: {},
        password: "baz"
      })
    ).to.be.rejectedWith(`expected param 'username' to be of type 'string'`);
  });

  it("[create] should throw error if password is not a string", function() {
    expect(
      feather.credentials.create({
        type: credentialTypes.EMAIL_PASSWORD,
        email: "bar",
        username: "baz",
        password: true
      })
    ).to.be.rejectedWith(`expected param 'password' to be of type 'string'`);

    expect(
      feather.credentials.create({
        type: credentialTypes.EMAIL_PASSWORD,
        email: "bar",
        username: "baz",
        password: 123
      })
    ).to.be.rejectedWith(`expected param 'password' to be of type 'string'`);

    expect(
      feather.credentials.create({
        type: credentialTypes.EMAIL_PASSWORD,
        email: "bar",
        username: "baz",
        password: {}
      })
    ).to.be.rejectedWith(`expected param 'password' to be of type 'string'`);
  });

  it("[update] should update a credential", function() {
    feather._gateway.mockResponse = sampleReponse_valid;
    feather.credentials.update("foo", { one_time_code: "bar" }).then(res => {
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
    expect(
      feather.credentials.update(true, { one_time_code: "foo" })
    ).to.be.rejectedWith(`expected param 'id' to be of type 'string'`);

    expect(
      feather.credentials.update(123, { one_time_code: "foo" })
    ).to.be.rejectedWith(`expected param 'id' to be of type 'string'`);

    expect(
      feather.credentials.update({}, { one_time_code: "foo" })
    ).to.be.rejectedWith(`expected param 'id' to be of type 'string'`);

    expect(
      feather.credentials.update(null, { one_time_code: "foo" })
    ).to.be.rejectedWith(`expected param 'id' to be of type 'string'`);
  });

  it("[update] should throw error if one_time_code is not a string", function() {
    expect(
      feather.credentials.update("foo", { one_time_code: true })
    ).to.be.rejectedWith(
      `expected param 'one_time_code' to be of type 'string'`
    );

    expect(
      feather.credentials.update("foo", { one_time_code: 123 })
    ).to.be.rejectedWith(
      `expected param 'one_time_code' to be of type 'string'`
    );

    expect(
      feather.credentials.update("foo", { one_time_code: {} })
    ).to.be.rejectedWith(
      `expected param 'one_time_code' to be of type 'string'`
    );

    expect(
      feather.credentials.update("foo", { one_time_code: null })
    ).to.be.rejectedWith(`required param not provided: 'one_time_code'`);
  });
});
