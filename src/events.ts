export type InternalEvent = {
  userId: string;
  type: "post" | "comment";
  timestamp: number;
  source: "facebook" | "test" | "cli";
};
