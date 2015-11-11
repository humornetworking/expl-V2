'use strict';

angular.module('eXplApp')
  .controller('homeCtrl', function ($scope, Util) {


      Util.getUser()
          .success(function(data) {

            jQuery('#username').text(data.name);

          });

  });
