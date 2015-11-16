angular.module('eXplApp')


    .controller('sugestionCtrl', ['$scope','Util','$location', function($scope, Util, $location) {
        $scope.formData = {};

        $scope.createSugestion = function() {

            if ($scope.formData.sugestion != undefined) {

                Util.createSugestion( {
                    Sugestion : $scope.formData.sugestion

                }).success(function(){
                    $location.path('/');
                });

            }

        }



    }]);