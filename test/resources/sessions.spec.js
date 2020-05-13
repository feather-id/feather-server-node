"use strict";

const testUtils = require("../../testUtils");
const feather = testUtils.getSpyableFeather();

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const sampleReponse_anonymous = {
  id: "SES_82d099a8-f06d-490d-b68b-8a4546842bf1",
  object: "session",
  type: "anonymous",
  status: "active",
  token: "foo",
  user_id: "USR_e4e9bc4c-19c8-4da9-9eb3-4553d4bd37a6",
  created_at: "2020-01-01T15:40:40.61536699Z",
  revoked_at: null
};

const sampleReponse_authenticated = {
  id: "SES_82d099a8-f06d-490d-b68b-8a4546842bf1",
  object: "session",
  type: "authenticated",
  status: "active",
  token: "foo",
  user_id: "USR_e4e9bc4c-19c8-4da9-9eb3-4553d4bd37a6",
  created_at: "2020-01-01T15:40:40.61536699Z",
  revoked_at: null
};

describe("sessions resource", function() {
  before(function() {
    feather.sessions._feather = feather;
  });

  it("[create] should create an anonymous session", function() {
    feather._gateway.mockResponse = sampleReponse_anonymous;
    feather.sessions.create(null).then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "POST",
        path: "/sessions",
        data: {}
      });
    });
  });

  it("[create] should create an authenticated session", function() {
    feather._gateway.mockResponse = sampleReponse_authenticated;
    const credential = {
      token: "foo"
    };
    feather.sessions.create(credential).then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "POST",
        path: "/sessions",
        data: { credential_token: "foo" }
      });
    });
  });

  it("[list] should list sessions", function() {
    feather.sessions.list("USR_foo").then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "GET",
        path: "/sessions",
        data: { user_id: "USR_foo" }
      });
    });
  });

  it("[list] should throw error if user ID is not a string", function() {
    expect(feather.sessions.list(true)).to.be.rejectedWith(
      /User ID must be a string/
    );

    expect(feather.sessions.list(123)).to.be.rejectedWith(
      /User ID must be a string/
    );

    expect(feather.sessions.list({})).to.be.rejectedWith(
      /User ID must be a string/
    );

    expect(feather.sessions.list(null)).to.be.rejectedWith(
      /User ID must be a string/
    );
  });

  it("[retrieve] should retrieve a session", function() {
    feather.sessions.retrieve("SES_foo").then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "GET",
        path: "/sessions",
        data: { id: "SES_foo" }
      });
    });
  });

  it("[retrieve] should throw error if ID is not a string", function() {
    expect(feather.sessions.retrieve(true)).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.sessions.retrieve(123)).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.sessions.retrieve({})).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.sessions.retrieve(null)).to.be.rejectedWith(
      /ID must be a string/
    );
  });

  it("[revoke] should revoke a session", function() {
    const session = {
      token: "foo"
    };
    feather.sessions.revoke("SES_foo", session).then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "POST",
        path: "/sessions/SES_foo/revoke",
        data: { session_token: "foo" }
      });
    });
  });

  it("[revoke] should throw error if ID is not a string", function() {
    expect(feather.sessions.revoke(true, {})).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.sessions.revoke(123, {})).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.sessions.revoke({}, {})).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.sessions.revoke(null, {})).to.be.rejectedWith(
      /ID must be a string/
    );
  });

  it("[revoke] should throw error if session is not an object", function() {
    expect(feather.sessions.revoke("SES_foo", true)).to.be.rejectedWith(
      /Session must be an object/
    );

    expect(feather.sessions.revoke("SES_foo", 123)).to.be.rejectedWith(
      /Session must be an object/
    );

    expect(feather.sessions.revoke("SES_foo", "")).to.be.rejectedWith(
      /Session must be an object/
    );

    expect(feather.sessions.revoke("SES_foo", null)).to.be.rejectedWith(
      /Session cannot be null/
    );
  });

  it("[upgrade] should upgrade a session", function() {
    const credential = {
      token: "foo"
    };
    feather.sessions.upgrade("SES_foo", credential).then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "POST",
        path: "/sessions/SES_foo/upgrade",
        data: { credential_token: "foo" }
      });
    });
  });

  it("[upgrade] should throw error if ID is not a string", function() {
    expect(feather.sessions.upgrade(true, {})).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.sessions.upgrade(123, {})).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.sessions.upgrade({}, {})).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.sessions.upgrade(null, {})).to.be.rejectedWith(
      /ID must be a string/
    );
  });

  it("[upgrade] should throw error if credential is not an object", function() {
    expect(feather.sessions.upgrade("SES_foo", true)).to.be.rejectedWith(
      /Credential must be an object/
    );

    expect(feather.sessions.upgrade("SES_foo", 123)).to.be.rejectedWith(
      /Credential must be an object/
    );

    expect(feather.sessions.upgrade("SES_foo", "")).to.be.rejectedWith(
      /Credential must be an object/
    );

    expect(feather.sessions.upgrade("SES_foo", null)).to.be.rejectedWith(
      /Credential cannot be null/
    );
  });

  it("[validate] should validate a stale session", function() {
    var mockFeather = { ...feather };
    mockFeather.sessions._parseToken = token => {
      return new Promise(function(resolve, reject) {
        resolve({
          id: "SES_foo",
          status: "stale",
          token
        });
      });
    };
    return mockFeather.sessions.validate("fooToken").then(data => {
      expect(mockFeather._gateway.LAST_REQUEST).to.deep.equal({
        method: "POST",
        path: "/sessions/SES_foo/validate",
        data: { session_token: "fooToken" }
      });
    });
  });

  it("[validate] should resolve an active session", function() {
    var mockFeather = { ...feather };
    mockFeather.sessions._parseToken = token => {
      return new Promise(function(resolve, reject) {
        resolve({
          id: "SES_foo",
          status: "active",
          token
        });
      });
    };
    mockFeather._gateway.LAST_REQUEST = null;
    return mockFeather.sessions.validate("fooToken").then(data => {
      expect(data).to.deep.equal({
        id: "SES_foo",
        status: "active",
        token: "fooToken"
      });
      expect(mockFeather._gateway.LAST_REQUEST).to.be.null;
    });
  });

  it("[validate] should reject parsing errors", function() {
    var mockFeather = { ...feather };
    mockFeather.sessions._parseToken = token => {
      return new Promise(function(resolve, reject) {
        reject(new Error("parsing boom"));
      });
    };
    expect(mockFeather.sessions.validate("fooToken")).to.be.rejectedWith(
      "parsing boom"
    );
  });

  it("[validate] should reject gateway errors", function() {
    var mockFeather = { ...feather };
    mockFeather.sessions._parseToken = token => {
      return new Promise(function(resolve, reject) {
        resolve({
          id: "SES_foo",
          status: "stale",
          token
        });
      });
    };
    mockFeather._gateway.sendRequest = (method, path, data) => {
      return new Promise(function(resolve, reject) {
        reject(new Error("gateway boom"));
      });
    };
    expect(mockFeather.sessions.validate("fooToken")).to.be.rejectedWith(
      "gateway boom"
    );
  });
});
