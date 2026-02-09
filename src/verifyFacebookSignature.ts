import crypto from "crypto";

export function verifyFacebookSignature(
  rawBody: string,
  signatureHeader?: string
): boolean {
  const appSecret = process.env.FB_APP_SECRET;

  if (!signatureHeader || !appSecret) {
    return false;
  }

  const expected = "sha256=" + crypto
    .createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex");

  if (expected.length !== signatureHeader.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signatureHeader)
  );
}
