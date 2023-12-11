/* eslint-disable max-len */
const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User } = require('../../db/models');
const generateTokens = require('../../utils/authUtils');
const jwtConfig = require('../../config/jwtConfig');

// аутентицикация существующего пользователя
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // проверить, есть ли такой юзер в бд
    const user = await User.findOne({
      where: { email },
      // nest: true,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Нет такого пользователя',
      });
    }

    //  проверить пароли
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(403).json({
        success: false,
        message: 'Неправильный пароль',
      });
    }

    const userData = {
      id: user.id,
      email: user.email,
    };
    // сгенерируем jwt токены
    const { accessToken, refreshToken } = generateTokens({
      user: userData,
    });

    // устанавливаем куки
    res.cookie(jwtConfig.access.type, accessToken, {
      maxAge: jwtConfig.access.expiresIn,
      httpOnly: true,
    });
    res.cookie(jwtConfig.refresh.type, refreshToken, {
      maxAge: jwtConfig.refresh.expiresIn,
      httpOnly: true,
    });

    // отправляем ответ
    return res.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// создание нового пользователя
router.post('/register', async (req, res) => {
  try {
    const { role, email, password } = req.body;
    if (role === '' || email === '' || password === '') {
      res.status(400).json({ success: false, message: 'Заполните все поля' });
    }

    // если пользователь с таким email уже есть, возвращаем ошибку
    const foundUser = await User.findOne({ where: { email } });
    if (foundUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Такой пользователь уже существует' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ role, email, password: hash });

    const userData = { id: user.id, email: user.email };

    return res.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
// при логауте чистим все куки
router.get('/logout', (req, res) => {
  try {
    res.clearCookie(jwtConfig.access.type).clearCookie(jwtConfig.refresh.type);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// проверка активной сессии и отправка информации о пользователе
router.get('/check', (req, res) => {
  if (res.locals.user) {
    res.json({ message: 'success', user: res.locals.user });
  } else {
    res.status(401).json({ message: 'Пользователь не аутентифицирован' });
  }
});
module.exports = router;
