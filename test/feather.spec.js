"use strict";

const testUtils = require("../testUtils");
const Feather = require("../lib/feather");
const feather = require("../lib/feather")(testUtils.getFeatherApiKey());

const expect = require("chai").expect;

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
