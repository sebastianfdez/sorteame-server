const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const contestRoutes = require('./api/routes/contests');
const questionsRoutes = require('./api/routes/questions');
const userRoutes = require('./api/routes/user');

mongoose.connect(
    'mongodb+srv://sfernandez1:' +
    process.env.MONGO_ATLAS_PW +
    '@cluster0-lgjau.mongodb.net/test?retryWrites=true',
{
    useNewUrlParser: true,
})
.catch((error) => console.log('ERROR: ', error));

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

// Routes
app.use('/contests', contestRoutes);
app.use('/questions', questionsRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    })
});

module.exports = app;