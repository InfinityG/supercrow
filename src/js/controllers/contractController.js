(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$routeParams', 'tokenService', 'contractService',
        'contactService', 'walletService'];

    var ContractsController = function ($scope, $rootScope, $location, $routeParams, tokenService, contractService,
                                        contactService, walletService) {

        $scope.contacts = null;
        $scope.contactGroups = ['coaches', 'leaders', 'facilitators', 'caregivers'];
        $scope.currentContactGroup = null;

        $scope.currentReceivers = null;
        $scope.currentReceiverFullName = null;

        //$scope.oracles = null;
        //$scope.currentOracle = null;

        $scope.currentContract = null;
        $scope.contractType = null;
        $scope.signatureQuantity = null;
        $scope.currentPaymentAmount = {value: null};

        $scope.savedContracts = null;
        $scope.submittedContracts = null;

        $scope.daysOfWeek = {monday: false, tuesday: false, wednesday: false, thursday: false, friday: false};

        function init() {
            var context = tokenService.getContext();

            if (context == null || context == '')
                $location.path('/login');
            else
                loadData();
        }

        function loadData() {
            if ($routeParams.type)
                $scope.contractType = $routeParams.type;

            //populate lists
            $scope.contacts = contactService.getContacts();
            $scope.currentContract = getContractTemplate();
            $scope.currentReceivers = null;
            $scope.currentOracle = null;
            $scope.currentReceivers = $scope.getCurrentReceivers('facilitators');
        }

        function getContractTemplate() {
            return contractService.getBaseContractTemplate();
        }

        $scope.getCurrentReceivers = function (group) {
            $scope.currentContactGroup = group;
            var result = [];

            for (var x = 0; x < $scope.contacts.length; x++) {
                var contact = $scope.contacts[x];

                if ((contact.role == 'coach' && group == 'coaches') ||
                    (contact.role == 'leader' && group == 'leaders') ||
                    (contact.role == 'facilitator' && group == 'facilitators') ||
                    (contact.role == 'caregiver' && group == 'caregiver'))
                    result.push(contact);
            }

            console.debug('Facilitators length: ' + result.length);
            return result;
        };

        $scope.signatureQuantityChanged = function (qty) {
            $scope.signatureQuantity = qty;
        };

        //$scope.oracleSelected = function (oracle) {
        //    $scope.currentOracle = oracle;
        //    $scope.currentContract.participants[2].external_id = oracle.id;
        //    $scope.currentContract.participants[2].wallet.address = oracle.walletAddress;
        //    $scope.currentContract.participants[2].public_key = oracle.publicKey;
        //};

        //$scope.reasonSelected = function (reason) {
        //    $scope.currentContract.conditions[0].name = reason;
        //    $scope.currentContract.conditions[0].description = reason;
        //};

        $scope.contractSelected = function (contract) {
            $scope.currentContract = contract;
        };

        //$scope.receiverSelected = function (contact) {
        //    $scope.currentReceiver = contact;
        //    $scope.currentContract.participants[1].external_id = contact.id;
        //    $scope.currentContract.participants[1].wallet.address = contact.walletAddress;
        //    $scope.currentContract.participants[1].public_key = contact.publicKey;
        //
        //    $scope.currentReceiverFullName = contact.first_name + ' ' + contact.last_name;
        //};

        $scope.saveContract = function (contract) {
            contractService.createFacilitationContracts($scope.contractType, $scope.currentReceivers,
                $scope.signatureQuantity, $scope.daysOfWeek, $scope.currentPaymentAmount.value, contract);
        };

        $scope.sendContract = function (contract) {
            contractService.sendContract(contract);
        };

        $scope.deleteContract = function (contract) {
            contractService.deleteContract(contract);
        };

        init();
    };

    ContractsController.$inject = injectParams;

    angular.module('superCrow').controller('ContractsController', ContractsController);

}());