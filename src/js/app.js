angular.module('superCrow', [
  'ngRoute',
  'mobile-angular-ui',
  'superCrow.controllers.Main'
])

.config(function($routeProvider) {
  $routeProvider
      .when('/', {
          controller: 'ContractsController',
          templateUrl:'contract.html',
          reloadOnSearch: false
      })
      .when('/configuration', {
          templateUrl:'configuration.html',
          reloadOnSearch: false
      });
});