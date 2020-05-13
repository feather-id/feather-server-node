"use strict";

const feather = require("../../testUtils").getSpyableFeather();

const expect = require("chai").expect;

const user_empty = {
  id: "USR_e4e9bc4c-19c8-4da9-9eb3-4553d4bd37a6",
  object: "user",
  email: null,
  username: null,
  metadata: "{}",
  created_at: "2020-05-13T19:41:45.566791Z",
  updated_at: "2020-05-13T19:41:45.566791Z"
};

describe("users resource", function() {
  before(function() {
    feather.users._feather = feather;
  });

  it("[retrieve] should retrieve a user", function() {
    feather._gateway.mockResponse = user_empty;
    feather.users.retrieve("USR_foo").then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "GET",
        path: "/users",
        data: { id: "USR_foo" }
      });
    });
  });

  it("[retrieve] should throw error if ID is not a string", function() {
    expect(feather.users.retrieve(true)).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.users.retrieve(123)).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.users.retrieve({})).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.users.retrieve(null)).to.be.rejectedWith(
      /ID must be a string/
    );
  });

  it("[update] should update a user", function() {
    feather.users.update("USR_foo", "foo", "bar", {}).then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "POST",
        path: "/users/USR_foo",
        data: { email: "foo", username: "bar", metadata: "{}" }
      });
    });
  });

  it("[update] should throw error if id is not a string", function() {
    expect(feather.users.update(true, null, null, null)).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.users.update(123, null, null, null)).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.users.update({}, null, null, null)).to.be.rejectedWith(
      /ID must be a string/
    );

    expect(feather.users.retrieve(null, null, null, null)).to.be.rejectedWith(
      /ID must be a string/
    );
  });

  it("[update] should throw error if email is not a string", function() {
    expect(
      feather.users.update("USR_foo", true, null, null)
    ).to.be.rejectedWith(/Email must be a string/);

    expect(feather.users.update("USR_foo", 123, null, null)).to.be.rejectedWith(
      /Email must be a string/
    );

    expect(feather.users.update("USR_foo", {}, null, null)).to.be.rejectedWith(
      /Email must be a string/
    );
  });

  it("[update] should throw error if username is not a string", function() {
    expect(
      feather.users.update("USR_foo", null, true, null)
    ).to.be.rejectedWith(/Username must be a string/);

    expect(feather.users.update("USR_foo", null, 123, null)).to.be.rejectedWith(
      /Username must be a string/
    );

    expect(feather.users.update("USR_foo", null, {}, null)).to.be.rejectedWith(
      /Username must be a string/
    );
  });

  it("[update] should throw error if metadata is not an object", function() {
    expect(
      feather.users.update("USR_foo", null, null, true)
    ).to.be.rejectedWith(/Metadata must be an object/);

    expect(feather.users.update("USR_foo", null, null, 123)).to.be.rejectedWith(
      /Metadata must be an object/
    );

    expect(
      feather.users.update("USR_foo", null, null, "foo")
    ).to.be.rejectedWith(/Metadata must be an object/);
  });
});
