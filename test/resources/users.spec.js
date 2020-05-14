"use strict";

const feather = require("../../testUtils").getSpyableFeather();

const expect = require("chai").expect;

const sampleResponse_empty = {
  id: "USR_e4e9bc4c-19c8-4da9-9eb3-4553d4bd37a6",
  object: "user",
  email: null,
  username: null,
  metadata: `{}`,
  created_at: "2020-05-13T19:41:45.566791Z",
  updated_at: "2020-05-13T19:41:45.566791Z"
};

const sampleResponse_username = {
  id: "USR_e2969a70-bcde-4e63-a1b6-e479a0c20fb4",
  object: "user",
  email: null,
  username: "foo",
  metadata: `{"foo": 123}`,
  created_at: "2020-05-13T19:41:45.566791Z",
  updated_at: "2020-05-13T19:41:45.566791Z"
};

const sampleResponse_list = {
  object: "list",
  has_more: false,
  url: "/foo",
  data: [sampleResponse_empty, sampleResponse_username]
};

describe("users resource", function() {
  before(function() {
    feather.users._feather = feather;
  });

  it("[list] should list sessions", function() {
    const data = { limit: 100 };
    feather._gateway.mockResponse = sampleResponse_list;
    feather.users.list(data).then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "GET",
        path: "/users",
        data: data
      });
    });
  });

  it("[retrieve] should retrieve a user", function() {
    feather._gateway.mockResponse = sampleResponse_empty;
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
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.retrieve(123)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.retrieve({})).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.retrieve(null)).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );
  });

  it("[update] should update a user", function() {
    const data = { email: "foo", username: "bar", metadata: {} };
    feather._gateway.mockResponse = sampleResponse_username;
    feather.users.update("USR_foo", data).then(res => {
      expect(feather._gateway.LAST_REQUEST).to.deep.equal({
        method: "POST",
        path: "/users/USR_foo",
        data: { email: "foo", username: "bar", metadata: "{}" }
      });
    });
  });

  it("[update] should throw error if id is not a string", function() {
    expect(feather.users.update(true, {})).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.update(123, {})).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.update({}, {})).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );

    expect(feather.users.retrieve(null, {})).to.be.rejectedWith(
      `expected param 'id' to be of type 'string'`
    );
  });

  it("[update] should throw error if email is not a string", function() {
    expect(
      feather.users.update("USR_foo", {
        email: true,
        username: null,
        metadata: null
      })
    ).to.be.rejectedWith(`expected param 'email' to be of type 'string'`);

    expect(
      feather.users.update("USR_foo", {
        email: 123,
        username: null,
        metadata: null
      })
    ).to.be.rejectedWith(`expected param 'email' to be of type 'string'`);

    expect(
      feather.users.update("USR_foo", {
        email: {},
        username: null,
        metadata: null
      })
    ).to.be.rejectedWith(`expected param 'email' to be of type 'string'`);
  });

  it("[update] should throw error if username is not a string", function() {
    expect(
      feather.users.update("USR_foo", {
        email: null,
        username: true,
        metadata: null
      })
    ).to.be.rejectedWith(`expected param 'username' to be of type 'string'`);

    expect(
      feather.users.update("USR_foo", {
        email: null,
        username: 123,
        metadata: null
      })
    ).to.be.rejectedWith(`expected param 'username' to be of type 'string'`);

    expect(
      feather.users.update("USR_foo", {
        email: null,
        username: {},
        metadata: null
      })
    ).to.be.rejectedWith(`expected param 'username' to be of type 'string'`);
  });

  it("[update] should throw error if metadata is not an object", function() {
    expect(
      feather.users.update("USR_foo", {
        email: null,
        username: null,
        metadata: true
      })
    ).to.be.rejectedWith(`expected param 'metadata' to be of type 'object'`);

    expect(
      feather.users.update("USR_foo", {
        email: null,
        username: null,
        metadata: 123
      })
    ).to.be.rejectedWith(`expected param 'metadata' to be of type 'object'`);

    expect(
      feather.users.update("USR_foo", {
        email: null,
        username: null,
        metadata: "foo"
      })
    ).to.be.rejectedWith(`expected param 'metadata' to be of type 'object'`);
  });
});
