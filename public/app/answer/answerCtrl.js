  
  angular.module('eXplApp')


	.controller('answerCtrl', ['$scope','Questions', function($scope, Questions) {
		$scope.formData = {};
		$scope.loading = false;

		Questions.getTopQuestions()
			.success(function(data) {
				$scope.questions = data;
				$scope.loading = false;
			});


		$scope.searchQuestion = function() {


			if ($scope.formData.searchText != undefined) {
				$scope.loading = true;

				Questions.get()
					.success(function(data) {
						$scope.questions = data;
						$scope.loading = false;
					});
			}
		};



		$scope.searchQuestionByText = function() {


			if ($scope.formData.searchText != undefined && $scope.formData.searchText != "") {

				Questions.getByText({
					text : $scope.formData.searchText
				})
					.success(function(data) {
						$scope.questions = data;
						$scope.loading = false;
					});
			} else {
				$scope.questions = {};
			}
		};



	}])

	  .controller('myanswerCtrl', ['$scope','Answers', function($scope, Answers) {


		  Answers.getAnswerByUser()
			  .success(function(data) {
				  $scope.answers = data;

			  });



	  }])

	  .controller('showAnswerByIdCtrl', ['$scope','$routeParams','Answers', function($scope, $routeParams, Answers) {

		  $scope.formData = {};
		  $scope.question = {};
		  $scope.answers = {};

		  var idAnswer = $routeParams.param;
		  Answers.getAnswerById(
			  {_id : idAnswer}
		  )
			  .success(function(data) {

				  $scope.question._id = data[0]._id;
				  $scope.question.Title = data[0].Question.Title;
				  $scope.question.Subject = data[0].Question.Subject;
				  $scope.answers = data[0].Answers;


			  });


		  $scope.updateAnswer = function() {


			  if ($scope.formData.answer != undefined) {


				  Answers.update({
					  _id : $scope.question._id,
					  Answer : $scope.formData.answer
				  }).success(function(data){
					  $scope.answers = data.Answers;
					  $scope.formData.answer ="";
				  });



			  }
		  };



	  }])


	  .controller('firstAnswerCtrl', function($scope, $routeParams,Questions, Answers, $location) {

		  $scope.formData = {};
		  var idQuestion = $routeParams.param;

		  Questions.getById({
			  _id : idQuestion
		  }).success(function(data) {

			  $scope.formData.id = data[0]._id;
			  $scope.formData.question = data[0].Title;
			  $scope.formData.subject = data[0].Subject;

		  });

		  $scope.answerQuestion = function() {

			  if ($scope.formData.answer != undefined) {

				  Answers.create({
					  Question : {_id : $scope.formData.id,
						  Title : $scope.formData.question,
						  Subject : $scope.formData.subject} ,
					  Answer : $scope.formData.answer
				  }).success(function(data){
					  $location.path('showAnswerById/'+ data._id);
				  });

			  }

		  };





	  });




