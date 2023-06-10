module.exports = (req, res, next) => {
    let body = req.body;
    let error = [];

    if (!body.name || body.name === '') {
        error.push("Le nom du produit est incorrect.");
    }

    if (!body.description || body.description === '') {
        error.push("La description du produit est incorrecte.");
    }

    if (!body.price || body.price <= 0) {
        error.push("Le prix du produit est incorrect.");
    }

    if (error.length > 0) {
        return res.status(409).json({
            error: true,
            message: error
        });
    }

    return next();
};
