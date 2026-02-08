export type InternalEvent = {
  userId: string;
  type:
    | "post"
    | "comment"
    | "message"
    | "message_read";
  timestamp: number;
  source: "facebook" | "test" | "cli";

  // optioneel, future-proof
  targetId?: string;
  meta?: Record<string, any>;
};
