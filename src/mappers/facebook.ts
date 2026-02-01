import { InternalEvent } from "../events";

export function mapFacebookPost(payload: any): InternalEvent {
  return {
    userId: payload.author_id,
    type: "post",
    timestamp: payload.created_time,
    source: "facebook",
  };
}

export function mapFacebookComment(payload: any): InternalEvent {
  return {
    userId: payload.author_id,
    type: "comment",
    timestamp: payload.created_time,
    source: "facebook",
  };
}
