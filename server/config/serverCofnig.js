const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');

function serverConfig(app) {
  // чтобы у объекта res и req появились методы cookie
  app.use(cookieParser());

  // настройки для сервера, чтобы при отправке формы появлялось req.body
  app.use(express.urlencoded({ extended: true }));

  // учу сервер читать json
  app.use(express.json());

  //  чтобы логировались запросы
  app.use(morgan('dev'));

  // чтобы подключались стили (первым делом будет искать файлы в папке public)
  app.use(express.static(path.join(__dirname, '../public')));
}

module.exports = serverConfig;
