(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$routeParams', '$window', 'tokenService'];

    var SideBarController = function ($scope, $rootScope, $location, $routeParams, $window, tokenService) {

        $scope.currentRole = null;

        function init(){
            var context = tokenService.getContext();

            if(context != null)
                $scope.currentRole = context.role;
        }

        var loginEventListener = $rootScope.$on('loginEvent', function (event, args) {
            $scope.currentRole = args.role;
            console.debug('Role: ' + args.role);
        });

        var logoutEventListener = $rootScope.$on('logoutEvent', function (event, args) {
            $scope.currentRole = null;
            console.debug('Logged out!');
        });

        //clean up rootScope listener
        $scope.$on('$destroy', function() {
            loginEventListener();
            logoutEventListener();
        });

        init();
    };

    SideBarController.$inject = injectParams;

    angular.module('superCrow').controller('SideBarController', SideBarController);

}());