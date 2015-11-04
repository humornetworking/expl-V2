

module.exports = function (app, auth, notification) {

    var Question = require('../models/question');
    var Answer = require('../models/answer');

    app.get('/api/answers/:answer_id', function (req, res) {
        Answer.find({
            _id: req.params.answer_id
        }, function (err, answer) {
            if (err)
                res.send(err);

            res.json(answer);

        });
    });



    app.post('/api/answers', auth.ensureAuthorized, function (req, res) {

        var user = getUserFromToken(req);

        if (user != null) {

            Answer.create(
                {
                    Question: {
                        _id: req.body.Question._id,
                        Title: req.body.Question.Title,
                        Subject: req.body.Question.Subject
                    },
                    Answers : [{
                        Respuesta: req.body.Answer,
                        User : {
                            _id : user._id,
                            Name: user.name,
                            Email: user.email,
                            Type: user.type,
                            Token: user.token

                        },
                        Fecha : new Date()
                    }]
                }


                , function (err, answer) {
                    if (err) {
                        res.send(err);
                    } else {

                        //Aqui podría actualizar la question

                        Question.findOneAndUpdate(
                            {_id: req.body.Question._id},
                            {idAnswer: answer.id},
                            {safe: true, upsert: true},
                            function(err, question) {

                                if (err) {
                                    res.send(err)
                                } else {

                                    notification.answerReceived(answer, question);
                                    res.json(answer);
                                }


                            });


                    }
                });
        }


    });


    app.put('/api/answers', auth.ensureAuthorized, function (req, res) {

        var user = auth.getUserFromToken(req);

        if (user != null) {

            var rsp = {
                Respuesta :req.body.Answer,
                User : {
                    _id : user._id,
                    Name: user.name,
                    Email: user.email,
                    Type: user.type,
                    Token: user.token},
                Fecha : new Date()
            };



            Answer.findOneAndUpdate(
                {_id: req.body._id},
                {$push: {Answers: rsp}},
                {safe: true, upsert: true},
                function(err, answer) {
                    if (err) {
                        res.send(err)
                    } else {


                        Question.findOne(
                            {
                                "_id": answer.Question._id
                            }, function (err, question) {

                                if (err) {
                                    res.send(err)
                                } else {

                                    notification.answerReceived(answer, question);

                                    res.json(answer);
                                }


                            });



                    }
                });



        }


    });


    app.get('/api/myAnswers', auth.ensureAuthorized, function (req, res) {

        var user = auth.getUserFromToken(req);


        Answer.find().elemMatch('Answers' , {'User._id': user._id}).exec(function (err, answers) {

            if (err)
                res.send(err)

            res.json(answers);

        });



    });



}
