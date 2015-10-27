


module.exports = function (app, jwt) {


    require('./answer')(app);
    require('./question')(app);
    require('./user')(app, jwt);



    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    process.on('uncaughtException', function (err) {
        console.log(err);
    });

};