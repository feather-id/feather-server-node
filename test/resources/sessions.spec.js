"use strict";

const feather = require("../../testUtils").getSpyableFeather();

const expect = require("chai").expect;

describe("sessions resource", function() {
  it("[create] should create an anonymous session", function() {
    feather.sessions.create(null);
    expect(feather._gateway.LAST_REQUEST).to.deep.equal({
      method: "POST",
      path: "/sessions",
      data: {}
    });
  });

  it("[create] should create an authenticated session", function() {
    const credential = {
      token: "foo"
    };
    feather.sessions.create(credential);
    expect(feather._gateway.LAST_REQUEST).to.deep.equal({
      method: "POST",
      path: "/sessions",
      data: { credential_token: "foo" }
    });
  });

  it("[list] should list sessions", function() {
    feather.sessions.list("USR_foo");
    expect(feather._gateway.LAST_REQUEST).to.deep.equal({
      method: "GET",
      path: "/sessions",
      data: { user_id: "USR_foo" }
    });
  });

  it("[list] should throw error if user ID is not a string", function() {
    expect(() => {
      feather.sessions.list(true);
    }).to.throw(/User ID must be a string/);

    expect(() => {
      feather.sessions.list(123);
    }).to.throw(/User ID must be a string/);

    expect(() => {
      feather.sessions.list({});
    }).to.throw(/User ID must be a string/);

    expect(() => {
      feather.sessions.list(null);
    }).to.throw(/User ID must be a string/);
  });

  it("[retrieve] should retrieve a session", function() {
    feather.sessions.retrieve("SES_foo");
    expect(feather._gateway.LAST_REQUEST).to.deep.equal({
      method: "GET",
      path: "/sessions",
      data: { id: "SES_foo" }
    });
  });

  it("[retrieve] should throw error if ID is not a string", function() {
    expect(() => {
      feather.sessions.list(true);
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.sessions.list(123);
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.sessions.list({});
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.sessions.list(null);
    }).to.throw(/ID must be a string/);
  });

  it("[revoke] should revoke a session", function() {
    const session = {
      token: "foo"
    };
    feather.sessions.revoke("SES_foo", session);
    expect(feather._gateway.LAST_REQUEST).to.deep.equal({
      method: "POST",
      path: "/sessions/SES_foo/revoke",
      data: { session_token: "foo" }
    });
  });

  it("[revoke] should throw error if ID is not a string", function() {
    expect(() => {
      feather.sessions.revoke(true, {});
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.sessions.revoke(123, {});
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.sessions.revoke({}, {});
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.sessions.revoke(null, {});
    }).to.throw(/ID must be a string/);
  });

  it("[revoke] should throw error if session is not an object", function() {
    expect(() => {
      feather.sessions.revoke("SES_foo", true);
    }).to.throw(/Session must be an object/);

    expect(() => {
      feather.sessions.revoke("SES_foo", 123);
    }).to.throw(/Session must be an object/);

    expect(() => {
      feather.sessions.revoke("SES_foo", "");
    }).to.throw(/Session must be an object/);

    expect(() => {
      feather.sessions.revoke("SES_foo", null);
    }).to.throw(/Session cannot be null/);
  });

  it("[upgrade] should upgrade a session", function() {
    const credential = {
      token: "foo"
    };
    feather.sessions.upgrade("SES_foo", credential);
    expect(feather._gateway.LAST_REQUEST).to.deep.equal({
      method: "POST",
      path: "/sessions/SES_foo/upgrade",
      data: { credential_token: "foo" }
    });
  });

  it("[upgrade] should throw error if ID is not a string", function() {
    expect(() => {
      feather.sessions.upgrade(true, {});
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.sessions.upgrade(123, {});
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.sessions.upgrade({}, {});
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.sessions.upgrade(null, {});
    }).to.throw(/ID must be a string/);
  });

  it("[upgrade] should throw error if credential is not an object", function() {
    expect(() => {
      feather.sessions.upgrade("SES_foo", true);
    }).to.throw(/Credential must be an object/);

    expect(() => {
      feather.sessions.upgrade("SES_foo", 123);
    }).to.throw(/Credential must be an object/);

    expect(() => {
      feather.sessions.upgrade("SES_foo", "");
    }).to.throw(/Credential must be an object/);

    expect(() => {
      feather.sessions.upgrade("SES_foo", null);
    }).to.throw(/Credential cannot be null/);
  });
});
