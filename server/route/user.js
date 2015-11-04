module.exports = function(app, auth) {

    var User = require('../models/user');

    app.get('/api/user', auth.ensureAuthorized, function (req, res) {

        var user = auth.getUserFromToken(req);
        res.json(user);

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

}
