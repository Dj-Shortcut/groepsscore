import post from "./fixtures/facebookPost.json" with { type: "json" };
import comment from "./fixtures/facebookComment.json" with { type: "json" };
import { mapFacebookPost, mapFacebookComment } from "./mappers/facebook.js";
import { handleEvent } from "./handleEvent.js";
handleEvent(mapFacebookPost(post), true);
handleEvent(mapFacebookComment(comment), true);
//# sourceMappingURL=test-facebook-flow.js.map