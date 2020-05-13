"use strict";

const testUtils = require("../testUtils");
const Feather = require("../lib/feather");
const feather = require("../lib/feather")(testUtils.getFeatherApiKey());

const expect = require("chai").expect;

describe("feather constructor", function() {
  it("should only accept an api key of type string", function() {
    expect(() => {
      Feather(true);
    }).to.throw(/API key must be a string/);

    expect(() => {
      Feather(123);
    }).to.throw(/API key must be a string/);

    expect(() => {
      Feather({});
    }).to.throw(/API key must be a string/);

    expect(() => {
      Feather(null);
    }).to.throw(/API key must be a string/);

    expect(() => {
      Feather("test_123");
    }).to.not.throw();
  });

  it("should only accept a config with allowed properties", () => {
    expect(() => {
      Feather(testUtils.getFeatherApiKey(), {
        foo: "bar",
        baz: "qux"
      });
    }).to.throw(/Config may not contain the following attributes: foo, baz/);

    expect(() => {
      Feather(testUtils.getFeatherApiKey(), {
        host: "foo.feather.id",
        port: 321
      });
    }).to.not.throw();
  });

  it("should create a gateway", () => {
    expect(() => {
      return Feather(testUtils.getFeatherApiKey(), {})._gateway;
    }).to.not.be.null;
  });
});
