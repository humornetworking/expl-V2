angular.module('answerService', [])


    .factory('Answers', ['$http',function($http) {
        return {

            create : function(answerData) {
                return $http.post('/api/answers', answerData);
            },
            getAnswerByUser : function() {
                return $http.get('/api/myAnswers');
            },
            getAnswerById : function(data) {
                return $http.get('/api/answers/'+ data._id);
            },
            update : function(data) {
                return $http.put('/api/answers', data);
            }

        }
    }]);
