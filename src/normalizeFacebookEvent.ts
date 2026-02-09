import { InternalEvent } from "./events.js";

function normalizeMessagingEvent(m: any): InternalEvent | null {
  if (m.read) {
    return {
      userId: m.sender?.id ?? "",
      type: "message_read",
      timestamp: m.timestamp,
      source: "facebook",
      targetId: m.recipient?.id,
      meta: {
        watermark: m.read?.watermark,
      },
    };
  }

  if (m.message) {
    return {
      userId: m.sender?.id ?? "",
      type: "message",
      timestamp: m.timestamp,
      source: "facebook",
      targetId: m.recipient?.id,
      meta: {
        text: m.message.text,
        mid: m.message.mid,
      },
    };
  }

  return null;
}

function normalizeFeedChange(change: any, fallbackTs: number): InternalEvent | null {
  const value = change?.value;
  const item = value?.item;

  if (item === "post" || item === "comment") {
    return {
      userId: value?.from?.id ?? "",
      type: item,
      timestamp: value?.created_time ?? fallbackTs,
      source: "facebook",
      targetId: value?.post_id,
      meta: {
        commentId: value?.comment_id,
        parentId: value?.parent_id,
      },
    };
  }

  return null;
}

export function normalizeFacebookPayload(payload: any): InternalEvent[] {
  const events: InternalEvent[] = [];

  if (!payload?.entry) {
    return events;
  }

  for (const entry of payload.entry) {
    const messaging = entry.messaging || [];

    for (const m of messaging) {
      const event = normalizeMessagingEvent(m);
      if (event) {
        events.push(event);
      }
    }

    const changes = entry.changes || [];

    for (const change of changes) {
      const event = normalizeFeedChange(change, entry.time ?? Date.now());
      if (event) {
        events.push(event);
      }
    }
  }

  return events;
}
