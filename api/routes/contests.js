const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/auth-service');

const ContestsController = require('../controllers/contests');

const storage = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, './uploads/');
    },
    filename: (req, file, next) => {
        next(null, (new Date()).getTime() + file.originalname);
    }
})

const fileFilter = (req, file, next) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        return next(null, true);
    }
    return  next(new Error('Extension not alowed'), false);
};

const upload = multer({ storage, limits: {
    fileSize: 1024 * 1024 * 5,
}, fileFilter });

router.get('/', checkAuth, ContestsController.contests_get_all);

router.post('/', checkAuth, upload.single('contestImage'), ContestsController.contest_create);

router.get('/:contestId', checkAuth, ContestsController.contest_get_one);

router.patch('/:contestId', checkAuth, ContestsController.contest_update_one);

router.delete('/:contestId', ContestsController.contest_delete_one);

module.exports = router;