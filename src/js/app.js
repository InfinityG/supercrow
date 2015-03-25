(function () {
    var app = angular.module('superCrow', ['ngRoute', 'mobile-angular-ui']);

    app.config(function ($routeProvider, $httpProvider) {

        //authentication interceptor (http://beletsky.net/2013/11/simple-authentication-in-angular-dot-js-app.html)
        $httpProvider.interceptors.push('httpInterceptor');

        $routeProvider
            .when('/contract/type/:type?', {
                controller: 'ContractsController',
                templateUrl: 'contract.html',
                reloadOnSearch: false
            }).when('/contract/:contractId?', {
                controller: 'ContractsController',
                templateUrl: 'contract.html',
                reloadOnSearch: false
            })
            .when('/contracts', {
                controller: 'MyContractsController',
                templateUrl: 'contractList.html',
                reloadOnSearch: false
            })
            .when('/settings', {
                controller: 'SettingsController',
                templateUrl: 'settings.html',
                reloadOnSearch: false
            })
            .when('/login/:exit?', {
                controller: 'LoginController',
                templateUrl: 'login.html',
                reloadOnSearch: false
            })
            .when('/', {
                templateUrl: 'default.html',
                reloadOnSearch: false
            });
            //.when('/', {
            //    controller: 'ContractsController',
            //    redirectTo: '/contract/type/registration',
            //    //templateUrl: 'contract.html',
            //    reloadOnSearch: false
            //})
    });

    app.run(function(initializationService){
        initializationService.init();
    });

}());