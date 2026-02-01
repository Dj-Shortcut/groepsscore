import post from "./fixtures/facebookPost.json";
import comment from "./fixtures/facebookComment.json";
import { mapFacebookPost, mapFacebookComment } from "./mappers/facebook";
import { handleEvent } from "./handleEvent";

handleEvent(mapFacebookPost(post), true);
handleEvent(mapFacebookComment(comment), true);
