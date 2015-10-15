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
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
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
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
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


// Route State Load Spinner(used on page or content load)
MakeApp.directive('ngSpinnerLoader', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default
                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$routeChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });
                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$routeChangeSuccess', function() {
                    setTimeout(function(){
                        element.addClass('hide'); // hide spinner bar
                    },500);
                    $("html, body").animate({
                        scrollTop: 0
                    }, 500);   
                });
            }
        };
    }
])