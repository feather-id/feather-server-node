"use strict";

const feather = require("../../testUtils").getSpyableFeather();
const credentialTypes = require("../../lib/credentialTypes");

const expect = require("chai").expect;

describe("credentials resource", function() {
  it("[create] should create a credential", function() {
    feather.credentials.create("email", "foo@bar.com", "baz", "quz");
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

  it("[create] should throw error if type is not a string", function() {
    expect(() => {
      feather.credentials.create(true, "foo", "bar", "baz");
    }).to.throw(/Type must be a string/);

    expect(() => {
      feather.credentials.create(123, "foo", "bar", "baz");
    }).to.throw(/Type must be a string/);

    expect(() => {
      feather.credentials.create({}, "foo", "bar", "baz");
    }).to.throw(/Type must be a string/);

    expect(() => {
      feather.credentials.create(null, "foo", "bar", "baz");
    }).to.throw(/Type must be a string/);
  });

  it("[create] should throw error if type is invalid", function() {
    expect(() => {
      feather.credentials.create("foo", null, null, null);
    }).to.throw(/Invalid credential type: foo/);

    expect(() => {
      feather.credentials.create(credentialTypes.EMAIL, null, null, null);
    }).to.not.throw();
  });

  it("[create] should throw error if email is not a string", function() {
    expect(() => {
      feather.credentials.create(credentialTypes.EMAIL, true, "bar", "baz");
    }).to.throw(/Email must be a string/);

    expect(() => {
      feather.credentials.create(credentialTypes.EMAIL, 123, "bar", "baz");
    }).to.throw(/Email must be a string/);

    expect(() => {
      feather.credentials.create(credentialTypes.EMAIL, {}, "bar", "baz");
    }).to.throw(/Email must be a string/);

    expect(() => {
      feather.credentials.create(credentialTypes.EMAIL, null, "bar", "baz");
    }).to.not.throw();
  });

  it("[create] should throw error if username is not a string", function() {
    expect(() => {
      feather.credentials.create(
        credentialTypes.USERNAME_PASSWORD,
        "bar",
        true,
        "baz"
      );
    }).to.throw(/Username must be a string/);

    expect(() => {
      feather.credentials.create(
        credentialTypes.USERNAME_PASSWORD,
        "bar",
        123,
        "baz"
      );
    }).to.throw(/Username must be a string/);

    expect(() => {
      feather.credentials.create(
        credentialTypes.USERNAME_PASSWORD,
        "bar",
        {},
        "baz"
      );
    }).to.throw(/Username must be a string/);

    expect(() => {
      feather.credentials.create(
        credentialTypes.USERNAME_PASSWORD,
        "bar",
        null,
        "baz"
      );
    }).to.not.throw();
  });

  it("[create] should throw error if password is not a string", function() {
    expect(() => {
      feather.credentials.create(
        credentialTypes.EMAIL_PASSWORD,
        "bar",
        "baz",
        true
      );
    }).to.throw(/Password must be a string/);

    expect(() => {
      feather.credentials.create(
        credentialTypes.EMAIL_PASSWORD,
        "bar",
        "baz",
        123
      );
    }).to.throw(/Password must be a string/);

    expect(() => {
      feather.credentials.create(
        credentialTypes.EMAIL_PASSWORD,
        "bar",
        "baz",
        {}
      );
    }).to.throw(/Password must be a string/);

    expect(() => {
      feather.credentials.create(
        credentialTypes.EMAIL_PASSWORD,
        "bar",
        "baz",
        null
      );
    }).to.not.throw();
  });

  it("[update] should update a credential", function() {
    feather.credentials.update("foo", "bar");
    expect(feather._gateway.LAST_REQUEST).to.deep.equal({
      method: "POST",
      path: "/credentials/foo",
      data: {
        one_time_code: "bar"
      }
    });
  });

  it("[update] should throw error if ID is not a string", function() {
    expect(() => {
      feather.credentials.update(true, "foo");
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.credentials.update(123, "foo");
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.credentials.update({}, "foo");
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.credentials.update(null, "foo");
    }).to.throw(/ID must be a string/);
  });

  it("[update] should throw error if oneTimeCode is not a string", function() {
    expect(() => {
      feather.credentials.update("foo", true);
    }).to.throw(/OneTimeCode must be a string/);

    expect(() => {
      feather.credentials.update("foo", 123);
    }).to.throw(/OneTimeCode must be a string/);

    expect(() => {
      feather.credentials.update("foo", {});
    }).to.throw(/OneTimeCode must be a string/);

    expect(() => {
      feather.credentials.update("foo", null);
    }).to.throw(/OneTimeCode must be a string/);
  });
});
