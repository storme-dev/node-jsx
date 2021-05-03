module.exports = function (req, res, next) {
    Object.defineProperty(res, 'render', {
        value: function(component, props) {
            return res.send(component(props));
        },
        enumerable: false
    });
    next();
}