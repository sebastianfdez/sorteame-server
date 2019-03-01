const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Question = require('../models/question');

router.get('/', (req, res, next) => {
    Question.find().limit(20)
        .select('quantity productId')
        .populate('productId', 'name price _id')
        .exec()
        .then((questions) => {
            res.status(200).json({
                count: questions.length,
                questions: questions.map((question) => {
                    return {
                        quantity: question.quantity,
                        product: question.productId,
                        _id: question._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/questions/' + question._id
                        }
                    }
                })
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({error});
        });
});

router.post('/', (req, res, next) => {
    const question = new Question({
        _id: new mongoose.Types.ObjectId(),
        type: req.body.type,
        answerText: req.body.answerText,
        alternatives: req.body.alternatives,
        image: req.body.image,
    })
    question
        .save()
        .then((question) => {
            res.status(201).json({
                message: 'question created',
                question: {
                    type: question.type,
                    answerText: question.answerText,
                    alternatives: question.alternatives,
                    image: question.image,
                    _id: question._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/questions/' + question._id
                    }
                }
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({error});
        });
    // Product.findById(req.body.productId)
    //     .then((product) => {
    //         if (!product) {
    //             return res.status(404).json({
    //                 message: 'Product not found',
    //             })
    //         }
    //         const question = new question({
    //             _id: new mongoose.Types.ObjectId(),
    //             quantity: req.body.quantity,
    //             productId: product._id,
    //         })
    //         return question.save()
    //     })
    //     .then((question) => {
    //         res.status(201).json({
    //             message: 'question created',
    //             question: {
    //                 productId: question.productId,
    //                 quantity: question.quantity,
    //                 _id: question._id,
    //                 request: {
    //                     type: 'GET',
    //                     url: 'http://localhost:3000/questions/' + question._id
    //                 }
    //             }
    //         });
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         res.status(500).json({error});
    //     });
});

router.get('/:questionId', (req, res, next) => {
    const id = req.params.questionId;
    Question.findById(id)
        .select('quantity productId')
        .populate('productId', 'name price _id')
        .exec()
        .then((doc) => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'question not found' })
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({error});
        });
});

router.delete('/:questionId', (req, res, next) => {
    const id = req.params.questionId;
    Question.deleteOne({ _id: id })
        .exec()
        .then((response) => {
            res.status(200).json({
                message: 'question deleted',
            });
        })
        .catch((error) => {
            console.log(error); 
            res.status(500).json({error});
        });
});

module.exports = router;