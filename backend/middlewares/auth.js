import User from '../models/User.js';

export default async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'unknown';

        // Find or create the user atomically
        const user = await User.findOneAndUpdate(
            { ip, user_agent: userAgent },
            { $setOnInsert: { ip, user_agent: userAgent, createdAt: new Date() } },
            { new: true, upsert: true }
        );
        console.log('AuthMiddleware::User:', user);

        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
