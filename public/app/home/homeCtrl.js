'use strict';

angular.module('eXplApp')
  .controller('homeCtrl', function ($scope, Util, applicationService) {

        applicationService.toggleSidebar();
        applicationService.toggleSidebar();
        jQuery('.topnav').show();

      Util.getUser()
          .success(function(data) {

            jQuery('#username').text(data.name);

          });

  });
