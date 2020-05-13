"use strict";

const feather = require("../../testUtils").getSpyableFeather();

const expect = require("chai").expect;

describe("users resource", function() {
  it("[retrieve] should retrieve a user", function() {
    feather.users.retrieve("USR_foo");
    expect(feather._gateway.LAST_REQUEST).to.deep.equal({
      method: "GET",
      path: "/users",
      data: { id: "USR_foo" }
    });
  });

  it("[retrieve] should throw error if ID is not a string", function() {
    expect(() => {
      feather.users.retrieve(true);
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.users.retrieve(123);
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.users.retrieve({});
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.users.retrieve(null);
    }).to.throw(/ID must be a string/);
  });

  it("[update] should update a user", function() {
    feather.users.update("USR_foo", "foo", "bar", {});
    expect(feather._gateway.LAST_REQUEST).to.deep.equal({
      method: "POST",
      path: "/users/USR_foo",
      data: { email: "foo", username: "bar", metadata: "{}" }
    });
  });

  it("[update] should throw error if id is not a string", function() {
    expect(() => {
      feather.users.update(true, null, null, null);
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.users.update(123, null, null, null);
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.users.update({}, null, null, null);
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.users.retrieve(null, null, null, null);
    }).to.throw(/ID must be a string/);
  });

  it("[update] should throw error if email is not a string", function() {
    expect(() => {
      feather.users.update("USR_foo", true, null, null);
    }).to.throw(/Email must be a string/);

    expect(() => {
      feather.users.update("USR_foo", 123, null, null);
    }).to.throw(/Email must be a string/);

    expect(() => {
      feather.users.update("USR_foo", {}, null, null);
    }).to.throw(/Email must be a string/);

    expect(() => {
      feather.users.retrieve("USR_foo", null, null, null);
    }).to.not.throw();
  });

  it("[update] should throw error if username is not a string", function() {
    expect(() => {
      feather.users.update("USR_foo", null, true, null);
    }).to.throw(/Username must be a string/);

    expect(() => {
      feather.users.update("USR_foo", null, 123, null);
    }).to.throw(/Username must be a string/);

    expect(() => {
      feather.users.update("USR_foo", null, {}, null);
    }).to.throw(/Username must be a string/);

    expect(() => {
      feather.users.retrieve("USR_foo", null, null, null);
    }).to.not.throw();
  });

  it("[update] should throw error if metadata is not an object", function() {
    expect(() => {
      feather.users.update("USR_foo", null, null, true);
    }).to.throw(/Metadata must be an object/);

    expect(() => {
      feather.users.update("USR_foo", null, null, 123);
    }).to.throw(/Metadata must be an object/);

    expect(() => {
      feather.users.update("USR_foo", null, null, "foo");
    }).to.throw(/Metadata must be an object/);

    expect(() => {
      feather.users.update("USR_foo", null, null, {});
    }).to.not.throw();

    expect(() => {
      feather.users.retrieve("USR_foo", null, null, null);
    }).to.not.throw();
  });
});
