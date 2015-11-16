angular.module('utilService', [])

    // super simple service
    // each function returns a promise object
    .factory('Util', ['$http',function($http) {
        return {

            signin : function(loginInfo) {
                return $http.post('/signin', loginInfo);
            },
            getUser : function() {
                return $http.get('/api/user');
            },
            createSugestion : function(sugestion) {
                return $http.post('/api/sugestion', sugestion);
            }
        }
    }]);