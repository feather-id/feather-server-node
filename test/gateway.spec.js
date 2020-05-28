// "use strict";
//
// const testUtils = require("../testUtils");
// const Gateway = require("../lib/gateway");
// const gateway = new Gateway("foo_key");
//
// const nock = require("nock");
// const chai = require("chai");
// const chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
// const expect = chai.expect;
//
// describe("gateway", function() {
//   afterEach(function() {
//     nock.cleanAll();
//   });
//
//   it("should initialize with default values", function() {
//     const g = Gateway("foo");
//     expect(g._api).to.deep.equal({
//       auth: "Basic Zm9vOg==",
//       host: "api.feather.id",
//       port: "443",
//       protocol: "https",
//       basePath: "/v1"
//     });
//   });
//
//   it("should initialize with optional values", function() {
//     const g = Gateway("foo", {
//       host: "foo.com",
//       port: "123",
//       protocol: "bar",
//       basePath: "/qwerty"
//     });
//     expect(g._api).to.deep.equal({
//       auth: "Basic Zm9vOg==",
//       host: "foo.com",
//       port: "123",
//       protocol: "bar",
//       basePath: "/qwerty"
//     });
//   });
//
//   it("should construct an https request", function() {
//     const scope = nock("https://api.feather.id")
//       .get("/v1/foo")
//       .reply(200, { foo: "bar" });
//
//     expect(gateway.sendRequest("GET", "/foo", null)).to.eventually.deep.equal({
//       foo: "bar"
//     });
//   });
//
//   it("should build query params for GET requests", function() {
//     const scope = nock("https://api.feather.id", {
//       reqheaders: {
//         authorization: "Basic Zm9vX2tleTo=",
//         "content-type": "application/x-www-form-urlencoded"
//       }
//     })
//       .get("/v1/foo?id=qwerty")
//       .reply(200, { foo: "bar" });
//
//     expect(
//       gateway.sendRequest("GET", "/foo", { id: "qwerty" })
//     ).to.eventually.deep.equal({
//       foo: "bar"
//     });
//   });
//
//   it("should build encode request body for POST requests", function() {
//     const scope = nock("https://api.feather.id", {
//       reqheaders: {
//         authorization: "Basic Zm9vX2tleTo=",
//         "content-type": "application/x-www-form-urlencoded",
//         "content-length": 9
//       }
//     })
//       .post("/v1/foo", "id=qwerty")
//       .reply(200, { foo: "bar" });
//
//     expect(
//       gateway.sendRequest("POST", "/foo", { id: "qwerty" })
//     ).to.eventually.deep.equal({
//       foo: "bar"
//     });
//   });
//
//   it("should support overriding the protocol", function() {
//     const g = Gateway("foo", {
//       host: "localhost",
//       port: "123",
//       protocol: "http"
//     });
//     const scope = nock("http://localhost:123", {
//       reqheaders: {
//         authorization: "Basic Zm9vOg==",
//         "content-type": "application/x-www-form-urlencoded"
//       }
//     })
//       .get("/v1/foo")
//       .reply(200, { foo: "bar" });
//
//     expect(g.sendRequest("GET", "/foo", null)).to.eventually.deep.equal({
//       foo: "bar"
//     });
//   });
//
//   it("should reject an error", function() {
//     const scope = nock("https://api.feather.id")
//       .get("/v1/foo")
//       .replyWithError("boom");
//
//     expect(gateway.sendRequest("GET", "/foo", null)).to.be.rejectedWith("boom");
//   });
// });
