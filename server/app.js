require('@babel/register');
require('dotenv').config();
const express = require('express');

const serverConfig = require('./config/serverCofnig');
const indexRouter = require('./routes/index.routes');
const checkUser = require('./middlewares/verifyJWT');

const app = express();

serverConfig(app);

// проверка JWT токенов
app.use(checkUser);

app.use('/', indexRouter);

const PORT = 3000;

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`Сервер запустился на ${PORT}`);
});
