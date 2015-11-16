var mongoose = require('mongoose');

module.exports = mongoose.model('Sugestion', {

    Sugestion: {type: String, default: ''},
    User: {
        _id: {type: mongoose.Schema.ObjectId},
        Name: {type: String, default: ''},
        Email: {type: String, default: ''}
    },
    Date : {type: Date}


});