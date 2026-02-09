import crypto from "crypto";
export function verifyFacebookSignature(rawBody, signatureHeader) {
    if (!signatureHeader)
        return false;
    const expected = "sha256=" + crypto
        .createHmac("sha256", process.env.FB_APP_SECRET)
        .update(rawBody)
        .digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
}
//# sourceMappingURL=verifyFacebookSignature.js.map