import { IUser } from "../model/userModel";
import { JwtPayload } from "jsonwebtoken";

export interface ITokenPayload extends JwtPayload {
  userId: string;
  role: IUser["role"];
  iat: number;
  exp?: number;
}
