module.exports = function(app,jwt){

    return {
        ensureAuthorized : function(res, req, next){
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


        getUserFromToken : function (req) {

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
}
