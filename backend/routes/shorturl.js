import { Router } from "express";
import {
    getShortUrl,
    createShortUrl,
    deleteShortUrl,
    getUserShortUrls,
} from "../controllers/urlController.js";

const router = Router();

// Redirect from short URL
router.get("/:alias", getShortUrl);

// Create a new short URL
router.post("/", createShortUrl);

// Delete a short URL
router.delete("/:alias", deleteShortUrl);

// Get all URLs created by the user
router.get("/", getUserShortUrls);

export default router;
