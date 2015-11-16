/**
 * Created by avasquez on 24-10-2015.
 */

module.exports = function (app, jwt) {

    var Sugestion = require('../models/sugestion');


    app.post('/api/sugestion', function (req, res) {

        var user = getUserFromToken(req);

        if (user != null) {

            Sugestion.create({
                Sugestion: req.body.Sugestion,
                User: {
                    _id : user._id,
                    Name: user.name,
                    Email: user.email
                },
                Date : new Date()
            }, function (err, todo) {
                if (err) {
                    res.send(err);
                } else {

                    res.send(req.body.Sugestion);
                }
            });

        };

    });





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