import user from "../model/usermodel";

declare global {
  namespace express {
    interface request {
      user?: user;
    }
  }
}
