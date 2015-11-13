module.exports = function (app, jwt, mailgun) {


    var auth = require('../util/auth')(app, jwt); //TODO aqui hay un problema con el scope de las variables que deberian recibir los metodos definidos
    var notification = require('../util/notification')(app, mailgun);

    require('./question')(app,auth,jwt);
    require('./answer')(app, auth, notification,jwt);
    require('./user')(app,auth,jwt);


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