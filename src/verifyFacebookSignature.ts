import crypto from "crypto";

export function verifyFacebookSignature(
  rawBody: string,
  signatureHeader?: string
): boolean {
  if (!signatureHeader) return false;

  const expected = "sha256=" + crypto
    .createHmac("sha256", process.env.FB_APP_SECRET as string)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signatureHeader)
  );
}
