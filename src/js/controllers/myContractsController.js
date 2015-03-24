(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$routeParams', 'tokenService', 'contractService',
        'contactService', 'walletService'];

    var MyContractsController = function ($scope, $rootScope, $location, $routeParams, tokenService, contractService,
                                        contactService, walletService) {

        $scope.cannedReasons = ['Achieve 10 registrations', 'Perform 5 childcare sessions'];

        $scope.contacts = null;
        $scope.currentReceiver = null;
        $scope.currentReceiverFullName = null;

        $scope.oracles = null;
        $scope.currentOracle = null;

        $scope.savedContracts = null;
        $scope.submittedContracts = null;
        $scope.contractType = null;
        $scope.currentContract = null;

        function init() {
            var context = tokenService.getContext();

            if(context == null || context == '') {
                $location.path('/login');
            }else {


                setViewContentListener();
                loadData();
            }
        }

        //this is fired after the model and page has loaded
        function setViewContentListener(){
            $scope.$on('$viewContentLoaded', function() {
                var wallet = walletService.getWallet();
                if(wallet == null || wallet.address == null || wallet.secret == null) {
                    $rootScope.$broadcast('contractEvent', {
                        type: 'Notice',
                        message: "Please update your wallet details",
                        status: 0,
                        redirectUri:'/settings'
                    });
                }
            });
        }

        function loadData() {
            if ($routeParams.type)
                $scope.contractType = $routeParams.type;

            var contractId = ($routeParams.contractId)
                ? parseInt($routeParams.contractId) : 0;

            //populate lists
            $scope.contacts = contactService.getContacts();
            $scope.savedContracts = contractService.getSavedContracts();
            $scope.submittedContracts = contractService.getSubmittedContracts();

            if (contractId > 0) {
                //get the current contract
                $scope.currentContract = contractService.getContract(contractId);

                //get the current receiver and oracle
                var receiverId = $scope.currentContract.participants[1].external_id;
                var oracleId = $scope.currentContract.participants[2].external_id;

                for (var x = 0; x < $scope.contacts.length; x++) {
                    if ($scope.contacts[x].id == receiverId)
                        $scope.currentReceiver = $scope.contacts[x];
                    if ($scope.contacts[x].id == oracleId)
                        $scope.currentOracle = $scope.contacts[x];
                }
            } else {
                //new contract
                $scope.currentContract = getContractTemplate();
                $scope.currentReceiver = null;
                $scope.currentOracle = null;
            }
        }

        function getContractTemplate() {
            return contractService.getContractTemplate();
        }

        $scope.oracleSelected = function (oracle) {
            $scope.currentOracle = oracle;
            $scope.currentContract.participants[2].external_id = oracle.id;
            $scope.currentContract.participants[2].wallet.address = oracle.walletAddress;
            $scope.currentContract.participants[2].public_key = oracle.publicKey;
        };

        $scope.reasonSelected = function (reason) {
            $scope.currentContract.conditions[0].name = reason;
            $scope.currentContract.conditions[0].description = reason;
        };

        $scope.contractSelected = function (contract) {
            $scope.currentContract = contract;
        };

        $scope.receiverSelected = function (contact) {
            $scope.currentReceiver = contact;
            $scope.currentContract.participants[1].external_id = contact.id;
            $scope.currentContract.participants[1].wallet.address = contact.walletAddress;
            $scope.currentContract.participants[1].public_key = contact.publicKey;

            $scope.currentReceiverFullName = contact.first_name + ' ' + contact.last_name;
        };

        $scope.saveContract = function (contract) {
            contractService.saveContract(contract);
        };

        $scope.sendContract = function (contract) {
            contractService.sendContract(contract);
        };

        $scope.deleteContract = function (contract) {
            contractService.deleteContract(contract);
        };

        init();
    };

    MyContractsController.$inject = injectParams;

    angular.module('superCrow').controller('MyContractsController', MyContractsController);

}());