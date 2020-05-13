"use strict";

const testUtils = require("../../testUtils");
const feather = testUtils.getSpyableFeather();

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

  it("[retrieve] should reject gateway error", function() {
    const mockFeather = { ...feather };
    mockFeather._gateway.sendRequest = (method, path, data) => {
      return new Promise(function(resolve, reject) {
        reject(new Error("boom"));
      });
    };
    expect(mockFeather.publicKeys.retrieve("foo")).to.be.rejectedWith("boom");
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

  it("[retrieve] should returned cached public key", function() {
    const pubKey = testUtils.getFakePublicKey();
    const mockFeather = { ...feather };
    mockFeather.publicKeys._cachedPublicKeys["foo"] = pubKey;
    expect(mockFeather.publicKeys.retrieve("foo")).to.eventually.deep.equal(
      pubKey
    );
  });
});
