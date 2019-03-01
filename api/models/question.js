const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: { type: String },
    answerText: { type: String },
    alternatives: [ { type: String } ],
    image: { type: String }
});

module.exports = mongoose.model('Question', questionSchema);