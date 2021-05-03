const express = require('express');
const app = express();
const port = 7000;
app.use(function (req, res, next) {
    Object.defineProperty(res, 'render', {
        value: function(component) {
            return res.send(component());
        },
        enumerable: false
    });
    next();
});
function Header() {
    let text = `gfdfd`;
    return (`
        <h1>
            ${text}
        </h1>
    `)
}
function App() {
    let text = `gfdfd`;
    let elem = `<h1>Hello ${text}</h1>`;
    
    return (
    `
${Header ()}
        ${elem}
    `
    );
}
app.get('/', (req, res) => {
    res.render(App);
});
app.listen(port, () => {
    console.log(`Server listens http://localhost:${port}`);
});