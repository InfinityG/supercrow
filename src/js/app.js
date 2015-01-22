angular.module('superCrow', [
    'ngRoute',
    'mobile-angular-ui',
    'superCrow.controllers.Main'
])

    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/contract/:contractId?', {
                controller: 'ContractsController',
                templateUrl: 'contract.html',
                reloadOnSearch: false
            })
            .when('/contracts', {
                controller: 'ContractsController',
                templateUrl: 'contractList.html',
                reloadOnSearch: false
            })
            .when('/settings', {
                controller: 'SettingsController',
                templateUrl: 'settings.html',
                reloadOnSearch: false
            });

        $httpProvider.defaults.headers.common['Authorization'] = '7b2ebe64dc9149ac8a9e923bf2a6b233';
        $httpProvider.defaults.withCredentials = true;
    });