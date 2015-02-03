(function () {

    var injectParams = ['$scope', '$location'];

    var ModalController = function ($scope, $location) {
        $scope.message = null;
        $scope.type = null;
        $scope.status = null;

        $scope.cancelModal = function(){
            $scope.show = false;

            if($scope.redirect){
                $location.path('/');
            }
        };

        $scope.$on('contractEvent', function (event, args) {
            $scope.show = true;
            $scope.type = args.type;
            $scope.message = args.message;
            $scope.status = args.status;
        });
    };

    ModalController.$inject = injectParams;

    angular.module('superCrow').controller('ModalController', ModalController);

}());