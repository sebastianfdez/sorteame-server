const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then((user) => {
        if (user.length) {
            return res.status(409).json({message: 'User already exists'});
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        err,
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                    });
                    user
                    .save()
                    .then(result => res.status(201).json({message: 'User Created', result}))
                    .catch((error) => {
                        console.log(error);
                        res.status(500).json({error});
                    }) 
                }
            });
        }
    })
};

exports.user_signin = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then((users) => {
        if (!users.length) {
            return res.status(404).json({message: 'Mail do not exists'});
        }
        bcrypt.compare(req.body.password, users[0].password, (
            (err, result) => {
                if (err) {
                    return res.status(404).json({message: 'Auth fail'});
                }
                if (result) {
                    const token = jwt.sign({
                        email: users[0].email,
                        userId: users[0]._id,
                    },
                    process.env.JWT_PAYLOAD_KEY,
                    {
                        expiresIn: "48h",
                    })
                    return res.status(200).json({message: 'Conection succesfull', token});
                }
                return res.status(404).json({message: 'Auth fail'});
            }
        ));
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({error});
    });
};

exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
    .exec()
    .then((response) => {
        res.status(200).json({
            message: 'User deleted',
            response,
        })
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({error});
    });
};