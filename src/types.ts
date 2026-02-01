export type EventType = "post" | "comment";

export interface Event {
  id: string;
  userId: string;
  type: EventType;
  timestamp: number;
}

export interface UserScore {
  userId: string;
  total: number;
  weekly: number;
  updatedAt: number;
}
