(function () {

    var injectParams = ['$scope', '$routeParams', '$window', 'contractService', 'contactService', 'walletService', 'keyService'];

    var ContractsController = function ($scope, $routeParams, $window, contractService, contactService, walletService, keyService) {

        $scope.cannedReasons = ['Work Done', 'Goal Achieved', 'Goods Received', 'Recognition', 'Occasion/event'];

        $scope.contacts = null;
        $scope.currentReceiver = null;

        $scope.oracles = null;
        $scope.currentOracle = null;

        $scope.contracts = null;
        $scope.currentContract = null;

        $scope.currentSharedSecret = null;

        function init() {
            var contractId = ($routeParams.contractId) ? parseInt($routeParams.contractId) : 0;
            loadData(contractId);
        }

        function loadData(contractId) {
            //populate lists
            $scope.contacts = contactService.getContacts();
            $scope.contracts = contractService.getContracts();

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
                $scope.currentSharedSecret = getSharedSecret();
                $scope.currentContract = getContractTemplate();
                $scope.currentReceiver = null;
                $scope.currentOracle = null;
            }
        }

        function getSharedSecret() {
            var wallet = walletService.getWallet();
            return wallet != null ? keyService.getSplitWalletSecret(wallet) : null;
        }

        function getContractTemplate() {
            var creatorPublicSigningKey = keyService.getSigningKeyPair().pk;
            var creatorWalletAddress = walletService.getWallet().address;
            var creatorSsKeyFragment = $scope.currentSharedSecret[0];
            return contractService.getContractTemplate(creatorPublicSigningKey, creatorWalletAddress, creatorSsKeyFragment);
        }

        function setUnixDate(contract){
            var dateArr = contract.expires.split('/');
            var unixExpiry = new Date(dateArr[2], dateArr[1], dateArr[0]).getTime() / 1000;
            contract.expires = unixExpiry;
            contract.conditions[0].expires = unixExpiry;
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
                setUnixDate(contract);
                contractService.saveContract(contract);
                keyService.saveSsPair($scope.currentSharedSecret);
                //loadData(0);
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

        $scope.clearForm = function () {
            loadData(0);
        };

        init();
    };

    ContractsController.$inject = injectParams;

    angular.module('superCrow').controller('ContractsController', ContractsController);

}());