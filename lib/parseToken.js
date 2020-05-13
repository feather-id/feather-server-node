"use strict";

var jws = require("jws");

function parseToken(tokenString, publicKeys) {
  return new Promise(function(resolve, reject) {
    // Parse the token
    const parsedToken = jws.decode(tokenString);

    // Verify signature algorithm
    const rs256 = "RS256";
    if (parsedToken.header.alg != rs256) {
      reject(new Error("Invalid signature algorithm"));
      return;
    }

    // Get the key ID
    if (!parsedToken.header.kid) {
      reject(new Error("Invalid key ID"));
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
            reject(new Error("Invalid signature"));
            return;
          }
        } catch (e) {
          reject(e);
          return;
        }

        // Verify claims
        if (parsedToken.payload.jti.length < 10) {
          reject(new Error("Invalid claim: jti"));
          return;
        }
        if (parsedToken.payload.iss !== "feather.id") {
          reject(new Error("Invalid claim: iss"));
          return;
        }
        if (parsedToken.payload.sub.length !== 40) {
          reject(new Error("Invalid claim: sub"));
          return;
        }
        if (parsedToken.payload.sub.substring(0, 4) !== "USR_") {
          reject(new Error("Invalid claim: sub"));
          return;
        }
        if (parsedToken.payload.aud.length !== 40) {
          reject(new Error("Invalid claim: aud"));
          return;
        }
        if (parsedToken.payload.aud.substring(0, 4) !== "PRJ_") {
          reject(new Error("Invalid claim: aud"));
          return;
        }
        if (parsedToken.payload.ses.length !== 40) {
          reject(new Error("Invalid claim: ses"));
          return;
        }
        if (parsedToken.payload.ses.substring(0, 4) !== "SES_") {
          reject(new Error("Invalid claim: ses"));
          return;
        }
        if (typeof parsedToken.payload.typ !== "string") {
          reject(new Error("Invalid claim: typ"));
          return;
        }

        // TODO Give buffer for clock skew?
        const now = Math.floor(Date.now() / 1000);
        if (typeof parsedToken.payload.iat !== "number") {
          reject(new Error("Invalid claim: iat"));
          return;
        }
        if (now < parsedToken.payload.iat) {
          reject(new Error("Invalid claim: iat"));
          return;
        }
        if (typeof parsedToken.payload.cat !== "number") {
          reject(new Error("Invalid claim: cat"));
          return;
        }
        if (typeof parsedToken.payload.exp !== "number") {
          reject(new Error("Invalid claim: exp"));
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
