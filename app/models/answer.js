var mongoose = require('mongoose');

module.exports = mongoose.model('Answer', {

    Question: {
        _id: {type: mongoose.Schema.ObjectId},
        Title: {type: String, default: ''},
        Subject: {type: String, default: ''}
    },
    Answers: [{
        Respuesta : {type: String, default: ''},
        User: {
            _id: {type: mongoose.Schema.ObjectId},
            Name: {type: String, default: ''},
            Email: {type: String, default: ''},
            Type: {type: String, default: ''},
            Token: {type: String, default: ''}

        },
        Fecha : {type: Date}
    }]

});
