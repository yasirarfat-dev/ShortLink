import ShortUrl from "../models/ShortUrl";

const createShortUrl = (data) => new ShortUrl(data).save();

const findByShortId = (shortId) => ShortUrl.findOne({ short_id: shortId });

const incrementClickCount = (shortId) =>
    ShortUrl.findOneAndUpdate(
        { short_id: shortId },
        { $inc: { clicks: 1 } },
        { new: true }
    );



// export the functions 

export {
    createShortUrl,
    findByShortId,
    incrementClickCount,
};