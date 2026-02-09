const GRAPH_API_VERSION = "v24.0";
export async function postToFacebookGroup(groupId, message) {
    const token = process.env.FB_PAGE_ACCESS_TOKEN;
    if (!token) {
        throw new Error("FB_PAGE_ACCESS_TOKEN is not configured");
    }
    if (!groupId) {
        throw new Error("FB_GROUP_ID is not configured");
    }
    const response = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${groupId}/feed`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });
    if (!response.ok) {
        const details = await response.text();
        throw new Error(`Facebook post failed (${response.status}): ${details || "unknown error"}`);
    }
}
//# sourceMappingURL=postToGroup.js.map