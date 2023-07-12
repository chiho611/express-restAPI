const User = require('../models/user');
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Error')
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {email, password, name} = req.body;
    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email,
                password: hashedPw,
                name
            })
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'User Created!',
                userId: result._id
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })
}

exports.login = (req, res, next) => {
    const {email, password} = req.body;
    let loadedUser;
    User.findOne({
        email
    })
        .then(user => {
            if (!user) {
                const error = new Error('User not Found!')
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong Password')
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },'someSecretKey' , {expiresIn: '1h'})

            res.status(200).json({
                token,
                userId : loadedUser._id.toString()
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}