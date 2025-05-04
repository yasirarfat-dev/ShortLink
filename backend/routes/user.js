import { Router } from "express";
import {
    getUserShortUrls,
} from "../controllers/urlController.js";

const router = Router();


router.get("/", getUserShortUrls);


export default router;