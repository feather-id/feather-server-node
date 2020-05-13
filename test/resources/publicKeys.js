"use strict";

const feather = require("../../testUtils").getSpyableFeather();

const expect = require("chai").expect;

describe("publicKeys resource", function() {
  it("[retrieve] should retrieve a public key", function() {
    feather.publicKeys.retrieve("foo");
    expect(feather._gateway.LAST_REQUEST).to.deep.equal({
      method: "GET",
      path: "/publicKeys",
      data: { id: "foo" }
    });
  });

  it("[retrieve] should throw error if ID is not a string", function() {
    expect(() => {
      feather.publicKeys.retrieve(true);
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.publicKeys.retrieve(123);
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.publicKeys.retrieve({});
    }).to.throw(/ID must be a string/);

    expect(() => {
      feather.publicKeys.retrieve(null);
    }).to.throw(/ID must be a string/);
  });
});
