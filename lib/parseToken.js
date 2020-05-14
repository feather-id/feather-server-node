"use strict";

var jws = require("jws");
const FeatherError = require("./errors/featherError");
const ErrorType = require("./errors/errorType");
const ErrorCode = require("./errors/errorCode");

function parseToken(tokenString, publicKeys) {
  return new Promise(function(resolve, reject) {
    // Parse the token
    const parsedToken = jws.decode(tokenString);
    if (!parsedToken) {
      reject(
        new FeatherError({
          type: ErrorType.VALIDATION,
          code: ErrorCode.SESSION_TOKEN_INVALID,
          message: "The session token is invalid"
        })
      );
      return;
    }

    // Verify signature algorithm
    const rs256 = "RS256";
    if (parsedToken.header.alg != rs256) {
      reject(
        new FeatherError({
          type: ErrorType.VALIDATION,
          code: ErrorCode.SESSION_TOKEN_INVALID,
          message: "The session token is invalid"
        })
      );
      return;
    }

    // Get the key ID
    if (!parsedToken.header.kid) {
      reject(
        new FeatherError({
          type: ErrorType.VALIDATION,
          code: ErrorCode.SESSION_TOKEN_INVALID,
          message: "The session token is invalid"
        })
      );
      return;
    }

    // Check cache for the key
    publicKeys
      .retrieve(parsedToken.header.kid)
      .then(pubKey => {
        // Verify signature
        try {
          const isValid = jws.verify(tokenString, rs256, pubKey.pem);
          if (!isValid) {
            reject(
              new FeatherError({
                type: ErrorType.VALIDATION,
                code: ErrorCode.SESSION_TOKEN_INVALID,
                message: "The session token is invalid"
              })
            );
            return;
          }
        } catch (e) {
          reject(
            new FeatherError({
              type: ErrorType.VALIDATION,
              code: ErrorCode.SESSION_TOKEN_INVALID,
              message: "The session token is invalid"
            })
          );
          return;
        }

        // Verify claims
        if (parsedToken.payload.jti.length < 10) {
          reject(
            new FeatherError({
              type: ErrorType.VALIDATION,
              code: ErrorCode.SESSION_TOKEN_INVALID,
              message: "The session token is invalid"
            })
          );
          return;
        }
        if (parsedToken.payload.iss !== "feather.id") {
          reject(
            new FeatherError({
              type: ErrorType.VALIDATION,
              code: ErrorCode.SESSION_TOKEN_INVALID,
              message: "The session token is invalid"
            })
          );
          return;
        }
        if (
          parsedToken.payload.sub.length !== 40 ||
          parsedToken.payload.sub.substring(0, 4) !== "USR_"
        ) {
          reject(
            new FeatherError({
              type: ErrorType.VALIDATION,
              code: ErrorCode.SESSION_TOKEN_INVALID,
              message: "The session token is invalid"
            })
          );
          return;
        }
        if (
          parsedToken.payload.aud.length !== 40 ||
          parsedToken.payload.aud.substring(0, 4) !== "PRJ_"
        ) {
          reject(
            new FeatherError({
              type: ErrorType.VALIDATION,
              code: ErrorCode.SESSION_TOKEN_INVALID,
              message: "The session token is invalid"
            })
          );
          return;
        }
        if (
          parsedToken.payload.ses.length !== 40 ||
          parsedToken.payload.ses.substring(0, 4) !== "SES_"
        ) {
          reject(
            new FeatherError({
              type: ErrorType.VALIDATION,
              code: ErrorCode.SESSION_TOKEN_INVALID,
              message: "The session token is invalid"
            })
          );
          return;
        }
        const ALLOWED_SESSION_TYPES = ["anonymous", "authenticated"];
        if (
          typeof parsedToken.payload.typ !== "string" ||
          !ALLOWED_SESSION_TYPES.includes(parsedToken.payload.typ)
        ) {
          reject(
            new FeatherError({
              type: ErrorType.VALIDATION,
              code: ErrorCode.SESSION_TOKEN_INVALID,
              message: "The session token is invalid"
            })
          );
          return;
        }

        // TODO Give buffer for clock skew?
        const now = Math.floor(Date.now() / 1000);
        if (
          typeof parsedToken.payload.iat !== "number" ||
          now < parsedToken.payload.iat
        ) {
          reject(
            new FeatherError({
              type: ErrorType.VALIDATION,
              code: ErrorCode.SESSION_TOKEN_INVALID,
              message: "The session token is invalid"
            })
          );
          return;
        }
        if (typeof parsedToken.payload.cat !== "number") {
          reject(
            new FeatherError({
              type: ErrorType.VALIDATION,
              code: ErrorCode.SESSION_TOKEN_INVALID,
              message: "The session token is invalid"
            })
          );
          return;
        }
        if (typeof parsedToken.payload.exp !== "number") {
          reject(
            new FeatherError({
              type: ErrorType.VALIDATION,
              code: ErrorCode.SESSION_TOKEN_INVALID,
              message: "The session token is invalid"
            })
          );
          return;
        }
        var sessionStatus = "active";
        if (now > parsedToken.payload.exp) {
          sessionStatus = "stale";
        }

        const session = {
          id: parsedToken.payload.ses,
          object: "session",
          type: parsedToken.payload.typ,
          status: sessionStatus,
          token: tokenString,
          userId: parsedToken.payload.sub,
          createdAt: parsedToken.payload.cat,
          revokedAt: null
        };

        resolve(session);
      })
      .catch(err => reject(err));
  });
}

module.exports = parseToken;
