import { InternalEvent } from "./events.js";

export function normalizeFacebookPayload(
  payload: any
): InternalEvent[] {
  const events: InternalEvent[] = [];

  if (!payload.entry) return events;

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
