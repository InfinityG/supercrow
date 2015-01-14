angular.module('superCrow', [
  'ngRoute',
  'mobile-angular-ui',
  'superCrow.controllers.Main'
])

.config(function($routeProvider) {
  $routeProvider
      .when('/contract/:contractId?', {
          controller: 'ContractsController',
          templateUrl:'contract.html',
          reloadOnSearch: false
      })
      .when('/contracts', {
          controller: 'ContractsController',
          templateUrl:'contractList.html',
          reloadOnSearch: false
      })
      .when('/configuration', {
          templateUrl:'configuration.html',
          reloadOnSearch: false
      });
});