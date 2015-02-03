(function () {

    var injectParams = ['$scope', '$location', '$routeParams', '$window', 'tokenService', 'contractService', 'contactService'];

    var ContractsController = function ($scope, $location, $routeParams, $window, tokenService, contractService, contactService) {

        $scope.cannedReasons = ['Work Done', 'Goal Achieved', 'Goods Received', 'Recognition', 'Occasion/event'];

        $scope.contacts = null;
        $scope.currentReceiver = null;

        $scope.oracles = null;
        $scope.currentOracle = null;

        $scope.savedContracts = null;
        $scope.submittedContracts = null;
        $scope.currentContract = null;

        function init() {
            var authToken = tokenService.getToken();
            if(authToken == null || authToken == '')
                $location.path('/login');

            var contractId = ($routeParams.contractId) ? parseInt($routeParams.contractId) : 0;
            loadData(contractId);
        }

        function loadData(contractId) {
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
        };

        $scope.saveContract = function (contract) {
            try {
                contractService.saveContract(contract);
            } catch (e) {
                $window.alert(e);
            }
        };

        $scope.sendContract = function (contract) {
            try {
                contractService.sendContract(contract);
            }catch(e){
                $window.alert(e);
            }
        };

        $scope.deleteContract = function (contract) {
            contractService.deleteContract(contract);
        };

        init();
    };

    ContractsController.$inject = injectParams;

    angular.module('superCrow').controller('ContractsController', ContractsController);

}());