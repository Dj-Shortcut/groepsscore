import assert from "node:assert/strict";
import { normalizeFacebookPayload } from "./normalizeFacebookEvent.js";
import { handleEvent } from "./handleEvent.js";

const payload = {
  entry: [
    {
      time: 1700000000000,
      changes: [
        {
          value: {
            item: "post",
            from: { id: "user-post" },
            created_time: 1700000001000,
            post_id: "post-1",
          },
        },
        {
          value: {
            item: "comment",
            from: { id: "user-comment" },
            created_time: 1700000002000,
            post_id: "post-1",
            comment_id: "comment-1",
          },
        },
      ],
      messaging: [
        {
          sender: { id: "user-message" },
          recipient: { id: "page-1" },
          timestamp: 1700000003000,
          message: { mid: "m-1", text: "hallo" },
        },
        {
          sender: { id: "user-message" },
          recipient: { id: "page-1" },
          timestamp: 1700000004000,
          read: { watermark: 1700000003500 },
        },
      ],
    },
  ],
};

const events = normalizeFacebookPayload(payload);
assert.equal(events.length, 4);
assert.deepEqual(events.map((e) => e.type), [
  "message",
  "message_read",
  "post",
  "comment",
]);

for (const event of events) {
  const result = handleEvent(event);
  assert.equal(result.ok, true);
}

console.log("normalizeFacebookPayload test passed");
