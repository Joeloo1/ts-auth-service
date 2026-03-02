import { Router } from "express";
import { updateUser, getMe, deleteMe } from "../controllers/user/user";
import protect from "../middleware/protect.Middleware";

const router = Router();

router.use(protect);

router.route("/updateMe").patch(updateUser);
router.route("/me").get(getMe);
router.route("/deleteMe").delete(deleteMe);

export default router;
