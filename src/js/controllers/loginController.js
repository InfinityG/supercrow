(function () {

    var injectParams = ['$scope', '$location', '$routeParams', '$window', 'tokenService', 'registrationService'];

    var LoginController = function ($scope, $location, $routeParams, $window, tokenService, registrationService) {

        $scope.firstName = null;
        $scope.lastName = null;
        $scope.userName = null;
        $scope.password = null;
        $scope.mobile = null;
        $scope.role = null;
        $scope.roles = ['coach', 'leader', 'facilitator', 'caregiver'];
        $scope.context = null;

        function init(){
            if($routeParams.exit != null)
                $scope.deleteToken();
            else
                $scope.context = tokenService.getContext();
        }

        $scope.roleSelected = function(role){
            $scope.role = role;
        };

        $scope.login = function (userName, password) {
            tokenService.login(userName, password);
        };

        $scope.deleteToken = function () {
            tokenService.deleteToken();
        };

        $scope.register = function (firstName, lastName, userName, password, mobile, role) {
            registrationService.register(firstName, lastName, userName, password, mobile, role);
        };

        init();
    };

    LoginController.$inject = injectParams;

    angular.module('superCrow').controller('LoginController', LoginController);

}());