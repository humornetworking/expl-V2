  
  angular.module('eXplApp')


	.controller('questionCtrl', ['$scope','Questions','$location', function($scope, Questions, $location) {
		$scope.formData = {};

		$scope.createQuestion = function() {

			if ($scope.formData.question != undefined) {


				var subject = jQuery('.select2-search-choice').text(); //Esto lo hago de esta forma pues no se como asignar este elemento a una propiedad del modelo

				Questions.create({
					Title : $scope.formData.question ,
					Subject : subject
				}).success(function(){
					$location.path('/');
				});

			}

		}



	}])
	  .controller('myquestionCtrl', ['$scope','Questions', function($scope, Questions) {



		  Questions.getQuestionByUser()
			  .success(function(data) {
				  $scope.questions = data;

			  });



	  }]);
