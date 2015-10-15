angular.module('socketService', [])

 .factory('socket', function ($rootScope) {
    var socket = io.connect();


   socket.on('message', function(msg){

       $.noty.defaults.killer = true;

      var formatedMessage = '<p>'+ msg.data +'</p><a href="#showAnswerById/'+ msg.id  +'">Leer Mensaje</a>';

           noty({
               text: formatedMessage,
               layout: 'topRight',
               closeWith: ['click', 'hover'],
               type: 'success',
               timeout: 4500,
               animation: {
                   open: 'animated bounceIn',
                   close: 'animated bounceOut'
               }
           });



        });





    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});