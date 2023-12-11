const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Получаем расширение файла
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + ext // Используем расширение файла для формирования имени файла
    );
  },
});

const upload = multer({ storage });

module.exports = upload;
