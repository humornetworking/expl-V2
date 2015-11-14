/**
 * Created by avasquez on 24-10-2015.
 */

module.exports = function (app, auth) {

var Question = require('../models/question');


app.get('/api/questions', auth.ensureAuthorized, function (req, res) {


    Question.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(todos); // return all todos in JSON format
    });
});


app.get('/api/questions/getByText/:pattern', auth.ensureAuthorized, function (req, res) {


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

app.post('/api/questions', auth.ensureAuthorized, function (req, res) {

    var user = auth.getUserFromToken(req);

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


app.get('/api/myQuestions', auth.ensureAuthorized, function (req, res) {

    var user = auth.getUserFromToken(req);

    Question.find({
        'User._id': user._id
    }, function (err, questions) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(questions); // return all todos in JSON format
    });




});

}