module.exports = function (app,jwt,mailgun) {

    return  {
        ensureAuthorized : function(req, res, next) {

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
    },


        getUserFromToken : function(req) {

        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            var bearerToken = bearer[1];

            var user = jwt.decode(bearerToken, app.get('superSecret'));
            return user;
        } else {
            return null;
        }

    } ,

        sendNotification : function(answer,question) {

            var connections = app.get('connections');

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



    }

}