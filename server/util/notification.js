/**
 * Created by avasquez on 24-10-2015.
 */


module.exports = function(app,mailgun) {
    return {
        answerReceived :  function(answer,question) {

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