"use strict";

var expect = require("chai").expect;
var helloWorld = require("../index");

describe("#helloWorld", function() {
  it('should return "Hello, world!"', function() {
    var result = helloWorld();
    expect(result).to.equal("Hello, world!");
  });
});
