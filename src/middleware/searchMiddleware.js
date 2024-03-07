const fuzzysearch = require("fuzzysearch");

const searchMiddleware = (req, res, next) => {
    let { q } = req.query;
    if (q) {
        let filtered = db.products.filter(item => fuzzysearch(q, item.name));
        res.json(filtered);
    } else {
        next();
    }
}

module.exports = searchMiddleware;
