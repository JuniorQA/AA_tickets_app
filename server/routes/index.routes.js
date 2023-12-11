const router = require('express').Router();
const authRouter = require('./api/auth.routes');

router.use('/api/auth', authRouter);

module.exports = router;
