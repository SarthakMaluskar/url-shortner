const redisClient = require("../configs/redis");

const rateLimiter = ({
    bucketSize,
    refillRate, // tokens per second
    ttl = 3600 // seconds
}) => {

    return async (req, res, next) => {

        console.log("whoohoo rate limiter");
        const key = `rate:${req.ip}`;

        const now = Date.now();

        let bucket = await redisClient.get(key);

        if (!bucket) {

            bucket = {
                tokens: bucketSize - 1,
                lastRefill: now
            };

            await redisClient.set(
                key,
                JSON.stringify(bucket),
                {
                    EX: ttl
                }
            );

            return next();
        }

        bucket = JSON.parse(bucket);

        const elapsedSeconds = (now - bucket.lastRefill) / 1000;

        const refilledTokens = Math.min(
            bucketSize,
            bucket.tokens + elapsedSeconds * refillRate
        );

        if (refilledTokens < 1) {
            return res.status(429).json({
                message: "Too many requests"
            });
        }

        bucket.tokens = refilledTokens - 1;
        bucket.lastRefill = now;

        await redisClient.set(
            key,
            JSON.stringify(bucket),
            {
                EX: ttl
            }
        );

        next();
    };
};

module.exports = rateLimiter;