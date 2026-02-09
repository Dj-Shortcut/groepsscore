export function verifyFacebookWebhook(url, verifyToken) {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" &&
        typeof verifyToken === "string" &&
        verifyToken.length > 0 &&
        token === verifyToken &&
        typeof challenge === "string" &&
        challenge.length > 0) {
        return { status: 200, body: challenge };
    }
    return { status: 403, body: "Forbidden" };
}
//# sourceMappingURL=webhookVerification.js.map