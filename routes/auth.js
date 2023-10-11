/*
    path: api/login

*/

const { Router } = require('express');
const { check } = require('express-validator');

const { createUser, login, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/new', [
    check('name', 'name must be providen').not().isEmpty(),
    check('email', 'email must be providen').not().isEmpty(),
    check('password', 'password must be providen').not().isEmpty(),
    validateFields
], createUser);

router.post('/', [
    check('email', 'email must be providen').not().isEmpty(),
    check('password', 'password must be providen').not().isEmpty()
], login);

//validateJWT,
router.get('/renew', validateJWT, renewToken);


module.exports = router;