# node-jsx

Теперь вы можете писать HTML код прямо в вашем серверном коде. Вам не нужно разделять фронтенд и бэкенд.


Как и в JSX, вы можете вставлять переменные в HTML код.
Многострочный HTML код нужно помещать в ```<> </>```
```javascript
let tasks = ['Купить хлеб', 'Купить молоко'];

function TasksList(props) {
    let elems = tasks.map(value => <li>{value}</li>);
    return (
        <>
            <ul>
                {elems}
            </ul>
        </>
    );
}
```
При этом это никак не влияет на производительность вашего сервера. Все преобразования кода происходят перед запуском сервера. Весь JSX код компилируется в обычные строки.

Чтобы отобразить вашу страничку на сайте, в пакете есть интеграция с express
```javascript
const express = require('express');
const app = express();

const componentRenderer = require('./middlewares/renderComponent');
app.use(componentRenderer);

// Pages
const Home = require('./pages/Home');

app.get('/', (req, res) => {
    res.render(Home, { text: 'Text' });
});

app.listen(port, () => {
    console.log(`Server listens http://localhost:${port}`);
});
```

Кстати, при рендере шаблона в express вы можете передавать параметры, которые можете использовать в шаблоне.
