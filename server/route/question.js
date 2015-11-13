/**
 * Created by avasquez on 24-10-2015.
 */

module.exports = function (app, auth,jwt) {

var Question = require('../models/question');


app.get('/api/questions', ensureAuthorized, function (req, res) {


    Question.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(todos); // return all todos in JSON format
    });
});


app.get('/api/questions/getByText/:pattern', ensureAuthorized, function (req, res) {


    var expression = new RegExp('.*'+ req.params.pattern +'.*','i');
    Question.find(

        { $or:[

            {
                Title: {$regex: expression}
            }, {
                Subject: {$regex: expression}
            }

        ]}
        , function (err, questions) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(questions); // return all todos in JSON format
        });
});


app.get('/api/topQuestions', function (req, res) {

    Question.find({Date: {$lt: new Date()}}).limit(5).exec(function (err, question) {
        if (err)
            res.send(err);

        res.json(question);

    });


});

app.get('/api/questions/:question_id', function (req, res) {
    Question.find({
        _id: req.params.question_id
    }, function (err, question) {
        if (err)
            res.send(err);

        res.json(question);

    });
});

app.post('/api/questions', ensureAuthorized, function (req, res) {

    var user = getUserFromToken(req);

    if (user != null) {

        Question.create({
            Title: req.body.Title,
            Subject: req.body.Subject,
            User: {
                _id : user._id,
                Name: user.name,
                Email: user.email
            }
        }, function (err, todo) {
            if (err) {
                res.send(err);
            } else {

                res.send(req.body.Title);
            }
        });

    };

});


app.get('/api/myQuestions', ensureAuthorized, function (req, res) {

    var user = getUserFromToken(req);

    Question.find({
        'User._id': user._id
    }, function (err, questions) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(questions); // return all todos in JSON format
    });




});

    function ensureAuthorized(req, res, next) {

        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];

            // verifies secret and checks exp
            jwt.verify(bearerToken, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    //return res.json({ success: false, message: 'Failed to authenticate token.' });
                    res.send(403);
                } else {
                    // if everything is good, save to request for use in other routes
                    req.token = bearerToken;
                    next();
                }
            });


        } else {
            res.send(403);
        }
    }

    function getUserFromToken(req) {

        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            var bearerToken = bearer[1];

            var user = jwt.decode(bearerToken, app.get('superSecret'));
            return user;
        } else {
            return null;
        }

    }



}