import ShortUrl from "../models/ShortUrl.js";
import { nanoid } from 'nanoid';
import Joi from 'joi';
import urlSchema from '../services/ValidationService.js';



// Redirect from a short URL
const getShortUrl = async (req, res) => {
    const { alias } = req.params;

    try {
        const shortUrl = await ShortUrl.findOne({ alias });
        if (!shortUrl) return res.status(404).json({ error: "URL not found." });

        shortUrl.clicks += 1;
        await shortUrl.save();

        return res.redirect(shortUrl.url);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// Create a new short URL
const createShortUrl = async (req, res) => {
    const { url, alias } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required." });
    }

    try {
        let short_id = alias;

        // Validate URL and alias (if provided)
        const validation = urlSchema.validate({ url, alias: short_id });
        if (validation.error) {
            return res.status(400).json({ error: validation.error.details[0].message });
        }

        if (alias) {
            // Check for alias uniqueness
            const existingAlias = await ShortUrl.findOne({ alias });
            if (existingAlias) {
                return res.status(400).json({ error: "Alias already exists." });
            }
        } else {
            // Generate a unique alias
            let isUnique = false;
            while (!isUnique) {
                short_id = nanoid(6);
                const existingAlias = await ShortUrl.findOne({ alias: short_id });
                if (!existingAlias) {
                    isUnique = true;
                }
            }
        }

        // Create and save the new short URL
        const newUrl = await ShortUrl.create({
            alias: short_id,
            url,
            user: req.user._id,
        });

        return res.status(201).json({
            alias: newUrl.alias,
            url: `/s${newUrl.alias}`,
        });
    } catch (err) {
        console.error("Error creating short URL:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
};


// Delete a short URL owned by the user
const deleteShortUrl = async (req, res) => {
    const { alias } = req.params;
    const user = req.user;

    try {
        const url = await ShortUrl.findOne({ alias });
        if (!url) return res.status(404).json({ error: "URL not found." });

        if (url.user.toString() !== user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized to delete this URL." });
        }

        const success = await url.deleteOne();
        if (!success) {
            return res.status(500).json({ error: "Failed to delete the URL." });
        }
        return res.status(200).json({ message: "URL deleted successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// Get all short URLs for the user
const getUserShortUrls = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized." });
    try {
        const urls = await ShortUrl.find({ user: req.user._id }).select("alias url clicks createdAt").sort({ createdAt: -1 });
        return res.status(200).json({ urls });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error." });
    }
};
export {
    getShortUrl,
    createShortUrl,
    deleteShortUrl,
    getUserShortUrls,
};
