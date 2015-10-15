  
  angular.module('eXplApp')


	  .controller('explainCtrl', function($scope, $routeParams,Questions, Answers, $location) {

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
				  }).success(function(){
					  $location.path('/');
				  });

			  }

		  };


		  /*		$scope.recievedTroughSocket = "still waiting for data...";
		   $scope.sendWithSocket = function(msg){
		   socket.emit("something", msg);
		   }
		   socket.on("greetings", function(data){
		   console.log("user data: " + JSON.stringify(data));
		   $scope.recievedTroughSocket = data.msg;
		   });*/


	  });