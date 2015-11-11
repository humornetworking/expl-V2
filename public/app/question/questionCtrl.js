  
  angular.module('eXplApp')


	.controller('questionCtrl', ['$scope','Questions','$location', function($scope, Questions, $location) {
		$scope.formData = {};

		$scope.createQuestion = function() {

			if ($scope.formData.question != undefined) {

				Questions.create({
					Title : $scope.formData.question ,
					Subject : $scope.formData.profesion
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
