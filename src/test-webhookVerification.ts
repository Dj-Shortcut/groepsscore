import assert from "node:assert/strict";
import { verifyFacebookWebhook } from "./webhookVerification.js";

const verifyToken = "my-secret-token";

const successUrl = new URL(
  "http://localhost/webhook/facebook?hub.mode=subscribe&hub.verify_token=my-secret-token&hub.challenge=123abc"
);
const successResult = verifyFacebookWebhook(successUrl, verifyToken);
assert.deepEqual(successResult, { status: 200, body: "123abc" });

const wrongTokenUrl = new URL(
  "http://localhost/webhook/facebook?hub.mode=subscribe&hub.verify_token=wrong-token&hub.challenge=123abc"
);
const wrongTokenResult = verifyFacebookWebhook(wrongTokenUrl, verifyToken);
assert.deepEqual(wrongTokenResult, { status: 403, body: "Forbidden" });

const missingChallengeUrl = new URL(
  "http://localhost/webhook/facebook?hub.mode=subscribe&hub.verify_token=my-secret-token"
);
const missingChallengeResult = verifyFacebookWebhook(missingChallengeUrl, verifyToken);
assert.deepEqual(missingChallengeResult, { status: 403, body: "Forbidden" });

const wrongModeUrl = new URL(
  "http://localhost/webhook/facebook?hub.mode=unsubscribe&hub.verify_token=my-secret-token&hub.challenge=123abc"
);
const wrongModeResult = verifyFacebookWebhook(wrongModeUrl, verifyToken);
assert.deepEqual(wrongModeResult, { status: 403, body: "Forbidden" });

const missingEnvTokenResult = verifyFacebookWebhook(successUrl, undefined);
assert.deepEqual(missingEnvTokenResult, { status: 403, body: "Forbidden" });

console.log("webhook verification tests passed");
