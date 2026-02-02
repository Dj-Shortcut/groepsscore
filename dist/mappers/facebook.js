export function mapFacebookPost(payload) {
    return {
        userId: payload.author_id,
        type: "post",
        timestamp: payload.created_time,
        source: "facebook",
    };
}
export function mapFacebookComment(payload) {
    return {
        userId: payload.author_id,
        type: "comment",
        timestamp: payload.created_time,
        source: "facebook",
    };
}
//# sourceMappingURL=facebook.js.map