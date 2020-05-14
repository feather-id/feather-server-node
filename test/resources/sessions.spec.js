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

const sampleReponse_revoked = {
  id: "SES_82d099a8-f06d-490d-b68b-8a4546842bf1",
  object: "session",
  type: "authenticated",
  status: "revoked",
  token: "foo",
  user_id: "USR_e4e9bc4c-19c8-4da9-9eb3-4553d4bd37a6",
  created_at: "2020-01-01T15:40:40.61536699Z",
  revoked_at: "2020-01-01T16:40:40.61536699Z"
};

const sampleResponse_list = {
  object: "list",
  has_more: false,
  url: "/foo",
  data: [sampleReponse_anonymous, sampleReponse_authenticated]
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
        data: null
      });
    });
  });

  it("[create] should create an authenticated session", function() {
    feather._gateway.mockResponse = sampleReponse_authenticated;
    const data = {
      credential_token: "foo"
    };
    feather.sessions.create(data).then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "POST",
        path: "/sessions",
        data: data
      });
    });
  });

  it("[list] should list sessions", function() {
    const data = { user_id: "USR_foo" };
    feather._gateway.mockResponse = sampleResponse_list;
    feather.sessions.list(data).then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "GET",
        path: "/sessions",
        data
      });
    });
  });

  it("[list] should throw error if user ID is not a string", function() {
    expect(feather.sessions.list({ user_id: true })).to.be.rejectedWith(
      `expected param 'user_id' to be of type 'string'`
    );

    expect(feather.sessions.list({ user_id: 123 })).to.be.rejectedWith(
      `expected param 'user_id' to be of type 'string'`
    );

    expect(feather.sessions.list({ user_id: {} })).to.be.rejectedWith(
      `expected param 'user_id' to be of type 'string'`
    );
  });

  it("[retrieve] should retrieve a session", function() {
    feather._gateway.mockResponse = sampleReponse_authenticated;
    feather.sessions.retrieve("SES_foo").then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "GET",
        path: "/sessions/SES_foo",
        data: null
      });
    });
  });

  it("[retrieve] should throw error if ID is not a string", function() {
    expect(feather.sessions.retrieve(true)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.sessions.retrieve(123)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.sessions.retrieve({})).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.sessions.retrieve(null)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );
  });

  it("[revoke] should revoke a session", function() {
    feather._gateway.mockResponse = sampleReponse_revoked;
    const data = {
      session_token: "foo"
    };
    feather.sessions.revoke("SES_foo", data).then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "POST",
        path: "/sessions/SES_foo/revoke",
        data: data
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

  it("[revoke] should throw error if session_token is not an string", function() {
    expect(
      feather.sessions.revoke("SES_foo", { session_token: true })
    ).to.be.rejectedWith(
      `expected param 'session_token' to be of type 'string'`
    );

    expect(
      feather.sessions.revoke("SES_foo", { session_token: 123 })
    ).to.be.rejectedWith(
      `expected param 'session_token' to be of type 'string'`
    );

    expect(
      feather.sessions.revoke("SES_foo", { session_token: null })
    ).to.be.rejectedWith(`required param not provided: 'session_token'`);
  });

  it("[upgrade] should upgrade a session", function() {
    feather._gateway.mockResponse = sampleReponse_authenticated;
    const data = {
      credential_token: "foo"
    };
    feather.sessions.upgrade("SES_foo", data).then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "POST",
        path: "/sessions/SES_foo/upgrade",
        data: data
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

  it("[upgrade] should throw error if credential_token is not an string", function() {
    expect(
      feather.sessions.upgrade("SES_foo", { credential_token: true })
    ).to.be.rejectedWith(
      `expected param 'credential_token' to be of type 'string'`
    );

    expect(
      feather.sessions.upgrade("SES_foo", { credential_token: 123 })
    ).to.be.rejectedWith(
      `expected param 'credential_token' to be of type 'string'`
    );

    expect(
      feather.sessions.upgrade("SES_foo", { credential_token: null })
    ).to.be.rejectedWith(`required param not provided: 'credential_token'`);
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
