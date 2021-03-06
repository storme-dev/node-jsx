const Header = require('../components/Header');
module.exports = function(props) {
    return (
        `
            <html lang="ru">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Document</title>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
                </head>
                <body>
${Header()}
                    ${props.text}
                </body>
            </html>
            <style>
                html, body {
                    font-family: 'Roboto', sans-serif;
                }
            </style>
        `
    )
}