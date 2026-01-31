import { Router } from "express";

import signUp from "../controllers/auth/signup";
import login from "../controllers/auth/login";

const router = Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);

export default router;
