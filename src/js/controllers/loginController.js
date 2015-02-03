(function () {

    var injectParams = ['$scope', '$location', '$routeParams', '$window', 'tokenService', 'registrationService'];

    var LoginController = function ($scope, $location, $routeParams, $window, tokenService, registrationService) {

        $scope.firstName = null;
        $scope.lastName = null;
        $scope.userName = null;
        $scope.password = null;

        function init(){
            if($routeParams.exit != null)
                $scope.deleteToken();
        }

        $scope.login = function (userName, password) {
            tokenService.login(userName, password);
        };

        $scope.deleteToken = function () {
            tokenService.deleteToken();
        };

        $scope.register = function (firstName, lastName, userName, password) {
            registrationService.register(firstName, lastName, userName, password);
        };

        init();
    };

    LoginController.$inject = injectParams;

    angular.module('superCrow').controller('LoginController', LoginController);

}());