import { Request } from "express";
import { IUser } from "../model/userModel";

export interface AuthRequest extends Request {
  user: IUser;
}
