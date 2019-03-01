const mongoose = require('mongoose');

const contestSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    contestImage: { type: String },
    company: { type: String, required: true },
    dateInit: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    questionsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});

module.exports = mongoose.model('Contest', contestSchema);