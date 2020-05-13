"use strict";

const testUtils = require("../../testUtils");
const feather = testUtils.getSpyableFeather();

const expect = require("chai").expect;

describe("publicKeys resource", function() {
  before(function() {
    feather.publicKeys._feather = feather;
  });

  it("[retrieve] should retrieve a public key", function() {
    feather.publicKeys.retrieve("foo").then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "GET",
        path: "/publicKeys",
        data: { id: "foo" }
      });
    });
  });

  it("[retrieve] should throw error if ID is not a string", function() {
    expect(feather.publicKeys.retrieve(true)).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.publicKeys.retrieve(123)).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.publicKeys.retrieve({})).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.publicKeys.retrieve(null)).to.be.rejectedWith(
      /ID must be a string/
    );
  });

  it("[retrieve] should reject gateway error", function() {
    feather._gateway.sendRequest = (method, path, data) => {
      return new Promise(function(resolve, reject) {
        reject(new Error("boom"));
      });
    };
    expect(feather.publicKeys.retrieve("foo")).to.be.rejectedWith("boom");
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
