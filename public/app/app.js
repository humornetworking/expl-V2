'use strict';

/**
 * @ngdoc overview
 * @name eXplAppApp
 * @description
 * # eXplAppApp
 *
 * Main module of the application.
 */
var MakeApp = angular
  .module('eXplApp', [
    'ngResource',
    'ngRoute',
        'ui.bootstrap',
        'ngStorage',
	'questionService', 
	'answerService', 
	'utilService', 
	'socketService'
  ])
  .config(function ($routeProvider, $httpProvider) {
      $routeProvider
	    
		.when('/home', {
            templateUrl: 'app/home/home.html',
            controller: 'homeCtrl'
        })
		
		.when('/question', {
            templateUrl: 'app/question/question.html',
            controller: 'questionCtrl'
        })

          .when('/myquestions', {
              templateUrl: 'app/question/myquestions.html',
              controller: 'myquestionCtrl'
          })

          .when('/answer', {
              templateUrl: 'app/answer/answer.html',
              controller: 'answerCtrl'
          })

          .when('/myanswers', {
              templateUrl: 'app/answer/myanswers.html',
              controller: 'myanswerCtrl'
          })

            .when('/showAnswerById/:param', {
                templateUrl : 'app/answer/showAnswerById.html',
                controller  : 'showAnswerByIdCtrl'
            })

          .when('/firstAnswer/:param', {
              templateUrl : 'app/answer/firstAnswer.html',
              controller  : 'firstAnswerCtrl'
          })
	  
	  	.when('/login', {
            templateUrl: 'app/login/login.html',
            controller: 'loginCtrl'
        })
	  
        .when('/', {
            templateUrl: 'app/home/home.html',
            controller: 'homeCtrl'
        });



        $httpProvider.defaults.withCredentials = true;

        $httpProvider.interceptors.push(['$q', '$location', '$localStorage','socket', function($q, $location, $localStorage,socket) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        //config.headers.Authorization = 'Bearer ' + $localStorage.token;
                        $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.token;
                        socket.emit('authenticate', {token: $localStorage.token});
                    } else {
                        $location.path('/login'); //Si no esta autorizado lo mando al login
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        }]);



  });

