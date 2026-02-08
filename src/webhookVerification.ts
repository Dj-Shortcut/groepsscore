export type VerificationResult = {
  status: 200 | 403;
  body: string;
};

export function verifyFacebookWebhook(url: URL, verifyToken?: string): VerificationResult {
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    typeof verifyToken === "string" &&
    verifyToken.length > 0 &&
    token === verifyToken &&
    typeof challenge === "string" &&
    challenge.length > 0
  ) {
    return { status: 200, body: challenge };
  }

  return { status: 403, body: "Forbidden" };
}
