var Question = require('./models/question');
var Answer = require('./models/answer');
var User = require('./models/user');





module.exports = function (app, jwt, mailgun) {

    app.get('/api/user', ensureAuthorized, function (req, res) {

        var user = getUserFromToken(req);
        res.json(user);

    });

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

    app.get('/api/answers/:answer_id', function (req, res) {
        Answer.find({
            _id: req.params.answer_id
        }, function (err, answer) {
            if (err)
                res.send(err);

            res.json(answer);

        });
    });



    app.post('/api/answers', ensureAuthorized, function (req, res) {

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

                                    sendNotification(app.get('connections'),answer, question);
                                    res.json(answer);
                                }


                            });


/*                        Question.findOne(
                            {
                                "_id": req.body.Question._id
                            }, function (err, question) {

                                if (err) {
                                    res.send(err)
                                } else {

                                    sendNotification(app.get('connections'),answer, question);
                                    res.json(answer);
                                }


                            });*/



                    }
                });
        }


    });


    app.put('/api/answers', ensureAuthorized, function (req, res) {

        var user = getUserFromToken(req);

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

                                    sendNotification(app.get('connections'),answer, question);

                                    res.json(answer);
                                }


                            });



                    }
                });



        }


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

    app.get('/api/myAnswers', ensureAuthorized, function (req, res) {

        var user = getUserFromToken(req);


        Answer.find().elemMatch('Answers' , {'User._id': user._id}).exec(function (err, answers) {

            if (err)
                res.send(err)

            res.json(answers);

        });



    });


    app.post('/signin', function (req, res) {
        User.findOne({name: req.body.name, type: req.body.type}, function (err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    res.json({
                        type: false,
                        data: user,
                        token: user.token
                    });
                } else {

                    var userModel = new User();
                    userModel.name = req.body.name;
                    userModel.email = req.body.email;
                    userModel.type = req.body.type;



                    //TODO : Aqui yo primero deberia eliminar el usuario by name and tipo de autenticacion

                    User.create({
                        name: req.body.name,
                        email: req.body.email,
                        type: req.body.type

                    }, function (err, user) {
                        if (err) {
                            res.send(err);
                        } else {

                            var token = jwt.sign(user, app.get('superSecret'), {
                                expiresInMinutes: 1440 // expires in 24 hours
                            });

                            //Actualizo el token
                            User.update({_id: user.id}, {
                                token: token
                            }, function(err, affected, resp) {
                                console.log(resp);
                            })

                            res.json({
                                name: user.name,
                                email: user.email,
                                type: user.type,
                                token: token

                            });
                        }
                    });
                }
            }
        });
    });


    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
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


    function sendNotification(connections,answer,question) {

                    var data = {
                        from: 'postmaster@expl.fibonacci.cl',
                        to: question.User.Email,
                        subject: 'Ha LLegado una respuesta a tu pregunta :' + question.Title,
                        text: 'Respuesta :' + answer.Answers[answer.Answers.length -1].Respuesta
                    };

                    mailgun.messages().send(data, function (error, body) {
                        console.log(body);
                    });


                    //Envio una notificacion si el user esta conectado
                    if (connections[question.User._id] != undefined) {
                        var socket = connections[question.User._id];


                        socket.emit('message', {id: answer.id, data: "Tu pregunta ha sido respondida"});
                    }


    }

    process.on('uncaughtException', function (err) {
        console.log(err);
    });


};