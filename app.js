const express = require('express');
const path = require("path");
const session = require('express-session');
const morgan = require('morgan');

const account = require('./router/account');
const user = require('./router/user');
const article = require('./router/article');
const apiRoute = require('./router/apiRoute');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.use(morgan("short"));
app.use(express.urlencoded({'extended': true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));
app.use(session({secret: "P@ssw0rd", resave: true, saveUninitialized: true}));

app.use((err, req, res, next) => {
    console.log(err.message);
    response.status(500).send(err.message);
});

app.get('/', (req, res) => res.redirect('/account/signin'));

app.use('/account', account);
app.use('/api', apiRoute);
app.use('/user', user);
app.use('/article', article)



app.listen(8000);