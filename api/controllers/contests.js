
import { Contest } from '../models/contest';
import { mongoose } from 'mongoose';

export const contests_get_all = (req, res, next) => {
    Contest.find().limit(20)
        .select('name _id contestImage')
        .exec()
        .then((contests) => {
            res.status(200).json({
                count: contests.length,
                contests: contests.map((contest) => {
                    return {
                        name: contest.name,
                        contestImage: contest.contestImage? 'http://localhost:3000/' + contest.contestImage : null,
                        _id: contest._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/contests/' + contest._id
                        }
                    }
                })
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({error});
        });
};

export const contest_create = (req, res, next) => {
    const contest = new Contest({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        contestImage: req.file ? req.file.path: null,
        company: req.body.company,
        dateInit: req.body.dateInit,
        dateEnd: req.body.dateEnd,
        questionsIds: req.body.questionsIds? req.body.questionsIds: null,
    })
    contest
        .save()
        .then((contest) => {
            res.status(201).json({
                message: 'contest created',
                contest: {
                    price: contest.price,
                    name: contest.name,
                    contestImage: contest.contestImage,
                    company: contest.company,
                    dateInit: contest.dateInit,
                    dateEnd: contest.dateEnd,
                    _id: contest._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/contests/' + contest._id
                    }
                }
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({error});
        });
};

export const contest_get_one = (req, res, next) => {
    const id = req.params.contestId;
    Contest.findById(id)
        .select('name _id')
        .exec()
        .then((doc) => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'Contest not found' })
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({error});
        });
};

export const contest_update_one = (req, res, next) => {
    const id = req.params.contestId;
    const updateOps = {};
    for (const ops of Object.keys(req.body)) {
        updateOps[ops] = req.body[ops];
    }
    console.log(updateOps);
    Contest.updateOne({ _id: id }, { $set: updateOps})
        .exec()
        .then((response) => {
            Contest.findById(id)
            .select('name _id')
            .exec()
            .then((doc) => {
                console.log(doc);
                if (doc) {
                    res.status(200).json({
                        message: "Document has been updated",
                        contest: {
                            name: doc.name,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/contests/' + doc._id
                            }
                        },
                    });
                } else {
                    res.status(404).json({ message: 'contest not found' })
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({error});
            });
        })
        .catch((error) => {
            console.log(error); 
            res.status(500).json({error});
        });
};

export const contest_delete_one = (req, res, next) => {
    const id = req.params.contestId;
    Contest.deleteOne({ _id: id })
        .exec()
        .then((response) => {
            res.status(200).json({
                message: 'contest deleted',
            });
        })
        .catch((error) => {
            console.log(error); 
            res.status(500).json({error});
        });
};