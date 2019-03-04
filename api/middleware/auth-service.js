const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ");
        if (token[0] !== 'Bearer') {
            return res.status(401).json({
                message: 'Auth failed',
            })
        }
        const decoded = jwt.verify(token[1], process.env.JWT_PAYLOAD_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed',
        })
    }
};