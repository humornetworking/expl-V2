  
  angular.module('eXplApp')


	.controller('loginCtrl', function($scope, $localStorage, $location, Util, socket, applicationService) {


		  applicationService.toggleSidebar();
		  jQuery('.topnav').hide();
		  $scope.formData = {};



		  $scope.facebookLogin = function() {

			  OAuth.initialize('P0M9nmp8JTxEJCGcW9Sb3x83_Og');
			  OAuth.popup('facebook')
				  .done(function(result) {

					  result.get('/me?fields=name,email')
						  .done(function (response) {

							  Util.signin({
								  name  : response.name ,
								  email  : response.email ,
								  type : "Facebook"
							  }).success(function(data){
								  $localStorage.token = data.token;

								  socket.emit('authenticate', {token: data.token});

								  $location.path('/');
							  });


						  })

				  })
				  .fail(function (err) {
					  console.log(err);
				  });
		  };


		  $scope.googleLogin = function() {

			  OAuth.initialize('P0M9nmp8JTxEJCGcW9Sb3x83_Og');
			  OAuth.popup('google')
				  .done(function(result) {

					  result.me().done(function(data) {

						  Util.signin({
							  name  : data.name ,
							  email  : data.email ,
							  type : "Google"
						  }).success(function(data){
							  $localStorage.token = data.token;
							  socket.emit('authenticate', {token: data.token});
							  $location.path('/');
						  });
					  })

				  })
				  .fail(function (err) {
					  console.log(err);
				  });
		  };


		  $scope.mailLogin = function() {

			  Util.signin({
				  name  : $scope.formData.name ,
				  email  : $scope.formData.email ,
				  type : "Mail"
			  }).success(function(data){
				  $localStorage.token = data.token;
				  socket.emit('authenticate', {token: data.token});
				  $location.path('/');
			  });



		  };


	});
