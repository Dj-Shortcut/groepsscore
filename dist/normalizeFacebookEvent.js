export function normalizeFacebookPayload(payload) {
    const events = [];
    if (!payload.entry)
        return events;
    for (const entry of payload.entry) {
        const messaging = entry.messaging || [];
        for (const m of messaging) {
            if (m.read) {
                events.push({
                    userId: m.sender?.id ?? "",
                    type: "message_read",
                    timestamp: m.timestamp,
                    source: "facebook",
                    targetId: m.recipient?.id,
                });
                continue;
            }
            if (m.message) {
                events.push({
                    userId: m.sender?.id ?? "",
                    type: "message",
                    timestamp: m.timestamp,
                    source: "facebook",
                    targetId: m.recipient?.id,
                    meta: {
                        text: m.message.text,
                        mid: m.message.mid,
                    },
                });
                continue;
            }
        }
    }
    return events;
}
//# sourceMappingURL=normalizeFacebookEvent.js.map