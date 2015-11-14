module.exports = function (app, jwt, mailgun) {


    var auth = require('../util/auth')(app, jwt);
    var notification = require('../util/notification')(app, mailgun);

    require('./question')(app,auth);
    require('./answer')(app, auth, notification);
    require('./user')(app,auth);


    // Web application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html')
    });


    // Exception default  -------------------------------------------------------------
    process.on('uncaughtException', function (err) {
        console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
        console.error(err.stack)
        process.exit(1)
    })

}