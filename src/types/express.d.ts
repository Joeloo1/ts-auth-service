declare global {
  namespace Express {
    interface Request {
      user?: import("../model/userModel").IUser;
    }
  }
}

export {};
