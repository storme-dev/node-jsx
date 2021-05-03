const express = require('express');
const app = express();
const port = 7000;
// Middlewares
const componentRenderer = require('./middlewares/renderComponent');
app.use(componentRenderer);
// State
global.state = {
    headerText: 'Header'
}
// Pages
const Home = require('./pages/Home');
app.get('/', (req, res) => {
    res.render(Home, { text: 'Text' });
});
app.listen(port, () => {
    console.log(`Server listens http://localhost:${port}`);
});