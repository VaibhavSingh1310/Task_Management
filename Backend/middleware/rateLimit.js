const requestMap = new Map();
const timeMiddleware = (req, res, next) => {
    const currentTime = Date.now();
    const windowTime = 15 * 60 * 1000;
    const ipAddress = req.ip;
    const userData = requestMap.get(ipAddress);

    if (!userData) {
        requestMap.set(ipAddress, {count: 1,userTime: currentTime});
    } else{
        const {count,userTime} = userData;
        if(currentTime - userTime >= windowTime) {
            requestMap.set(ipAddress, {count: 1,userTime: currentTime});
        } else{
            if (count >= 10) {
                return res.status(429).json({
                    success: false,
                    message: "Exceeded limit of accessing the API. Please try again later."
                });
            }
            requestMap.set(ipAddress, {
                count: count + 1,
                userTime: userTime
            });
        }
    }

    next();
};

module.exports = timeMiddleware;
