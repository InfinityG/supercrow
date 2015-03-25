/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$rootScope', 'config', 'localStorageService', 'tokenService',
        'keyService', 'cryptoService', 'walletService'];

    var contractFactory = function ($http, $rootScope, config, localStorageService, tokenService,
                                    keyService, cryptoService, walletService) {

        var serviceBase = config.apiHost, nacl = config.nacl, factory = {};

        factory.getSavedContracts = function () {
            var userId = tokenService.getContext().userId;
            var contracts = localStorageService.getContracts(userId);

            var savedContracts = [];

            for (var x = 0; x < contracts.length; x++) {
                if (contracts[x].id == null || contracts[x].id == '')
                    savedContracts.push(contracts[x]);
            }
            return savedContracts;
        };

        factory.getSubmittedContracts = function () {
            var userId = tokenService.getContext().userId;
            var contracts = localStorageService.getContracts(userId);

            var submittedContracts = [];

            for (var x = 0; x < contracts.length; x++) {
                if (contracts[x].id != null && contracts[x].id != '')
                    submittedContracts.push(contracts[x]);
            }
            return submittedContracts;
        };

        factory.saveContract = function (contract) {
            var userId = tokenService.getContext().userId;
            localStorageService.saveContract(userId, contract);

            //emit event for modal
            $rootScope.$broadcast('contractEvent', {
                type: 'Success',
                status: 0,
                message: "Contract '" + contract.name + "' saved",
                redirectUri: '/'
            });
        };

        factory.updateContract = function (contract) {
            var userId = tokenService.getContext().userId;
            localStorageService.saveContract(userId, contract);

            //emit event for modal
            $rootScope.$broadcast('contractEvent', {
                type: 'Success',
                status: 0,
                message: "Contract '" + contract.name + "' updated'",
                redirectUri: '/'
            });
        };

        factory.deleteContract = function (contract) {
            var userId = tokenService.getContext().userId;
            localStorageService.deleteContract(userId, contract.external_id);

            //emit event for modal
            $rootScope.$broadcast('contractEvent', {
                type: 'Success',
                status: 0,
                message: "Contract '" + contract.name + "' deleted",
                redirectUri: '/'
            });
        };

        // the sending of a contract requires a number of finalization
        // steps, including signing - hence the password is required at this
        // point from the user
        factory.sendContract = function (password, contract) {

            if (factory.finalizeContract(password, contract)) {

                return $http.post(serviceBase + '/contracts', contract)
                    .then(function (response) {
                        localStorageService.saveContract(response.data);

                        //emit event for modal
                        $rootScope.$broadcast('contractEvent', {
                            type: 'Success',
                            status: response.status,
                            message: "Contract '" + contract.name + "' saved",
                            redirectUri: '/'
                        });
                    });
            }
        };

        factory.finalizeContract = function (password, contract) {
            //get the crypto key
            var userId = tokenService.getContext().userId;
            var cryptoKey = keyService.generateAESKey(password, nacl);

            //validate crypto key (this will emit an event if error)
            if (!cryptoService.validateAESKey(cryptoKey, contract.keys.sk))
                return false;

            //generate a shared secret at the last minute and save it
            var sharedSecret = factory.getSharedSecret();
            keyService.saveSsPair(userId, sharedSecret);

            //add a shared secret fragment to the contract
            contract.participants[0].wallet.secret.fragments.push(sharedSecret[0]);

            //update the date to unix format
            factory.setUnixDate(contract);

            // now sign the contract
            factory.signContract(cryptoKey, contract);

            return true;
        };

        factory.signContract = function (cryptoKey, contract) {
            var signingKey = cryptoService.decryptString(cryptoKey, contract.keys.sk);
            var contractDigest = cryptoService.createMessageDigest(JSON.stringify(contract));
            var signedContract = cryptoService.signMessage(contractDigest, signingKey);

            contract.signatures[0].value = signedContract;
            contract.signatures[0].digest = contractDigest;
        };

        factory.getContract = function (externalId) {
            var userId = tokenService.getContext().userId;
            var requestedContract = localStorageService.getContract(userId, externalId);

            if (requestedContract != null) {
                return requestedContract;
            }

            //emit event for modal
            $rootScope.$broadcast('contractEvent', {
                type: 'Error',
                status: 0,
                message: "Contract could not be found",
                redirectUri: '/'
            });
        };

        factory.getBaseContractTemplate = function () {
            var userId = tokenService.getContext().userId;

            var creatorSigningPair = keyService.getSigningKeyPair();
            var creatorPublicSigningKey = creatorSigningPair.pk;

            var creatorWalletAddress = null;
            var creatorWallet = walletService.getWallet();

            if (creatorWallet != null) {
                creatorWalletAddress = creatorWallet.address;
            }

            return {
                user_id: userId,
                external_id: 0,
                name: '',
                description: '',
                expires: '',
                participants: [
                    {
                        external_id: userId,
                        public_key: creatorPublicSigningKey,
                        roles: ['initiator', 'sender'],
                        wallet: {
                            address: creatorWalletAddress,
                            destination_tag: '',
                            secret: {
                                fragments: [],
                                threshold: 2
                            }
                        }
                    }
                    //{
                    //    external_id: 2,
                    //    public_key: '',
                    //    roles: ['oracle'],
                    //    wallet: {
                    //        address: '',
                    //        destination_tag: '',
                    //        secret: null
                    //    }
                    //}
                ],
                conditions: [],
                signatures: [
                    {
                        participant_external_id: 1,
                        type: 'ecdsa',
                        value: '',
                        digest: ''
                    }
                ]
            };
        };

        factory.createFacilitationContracts = function (contractType, facilitators, sigQty, daysOfWeek, amount, baseContract) {

            console.debug('Amount: ' + amount);

            if(facilitators == null || facilitators.length == 0) {
                //raise an error if no facilitators registered for this user
                //emit event for modal
                $rootScope.$broadcast('contractEvent', {
                    type: 'Error',
                    status: 0,
                    message: "No facilitators can be found!"
                });

                return;
            }

            // get selected days
            var daysArr = [];
            for (var property in daysOfWeek) {
                if (daysOfWeek.hasOwnProperty(property)) {
                    if (daysOfWeek[property] == true) {
                        daysArr.push(property);
                        console.debug(property);
                    }
                }
            }

            // we need 1 contract per recipient (ie: per facilitator)
            for (var x = 0; x < facilitators.length; x++) {

               // clone the baseContract
                var facilitatorContract = JSON.parse(JSON.stringify(baseContract));

                var currentRecipient = facilitators[x];

                var receiverParticipant = {
                    external_id: currentRecipient.id,
                    public_key: currentRecipient.publicKey,
                    roles: ['receiver'],
                    wallet: {
                        address: '',
                        destination_tag: '',
                        secret: null
                    }
                };

                facilitatorContract.participants.push(receiverParticipant);

                if (contractType == 'facilitation') {
                    // each contract has (daysOfWeek) conditions (no of days to run playgroup)
                    for (var z = 0; z < daysArr.length; z++) {

                        // each condition is signed by (sigQty) no of caregivers
                        var signatures = [];
                        for (var s = 0; s < sigQty; s++) {
                            signatures.push({
                                participant_external_id: currentRecipient.id,
                                type: 'ecdsa'
                            });
                        }

                        var condition = {
                            name: 'Playgroup facilitation for ' + daysArr[z],
                            description: 'Facilitating a playgroup',
                            expires: facilitatorContract.expires,
                            sequence_number: z + 1,
                            signatures: signatures,
                            trigger: {
                                //transactions: [
                                //    {
                                //        from_participant_external_id: baseContract.userId,
                                //        to_participant_external_id: currentRecipient.id,
                                //        amount: amount,
                                //        currency: "PDC"
                                //    }
                                //]
                                webhooks: [
                                    {
                                        "uri": "www.mywebhook1.com",
                                        "payload": {"amount": amount, "participant_id": currentRecipient.id}
                                    }
                                ]
                            }
                        };

                        facilitatorContract.conditions.push(condition);
                    }
                }

                factory.saveContract(facilitatorContract);
            }
        };

        factory.getSharedSecret = function () {
            var userId = tokenService.getContext().userId;
            var wallet = walletService.getWallet(userId);
            return wallet != null ? keyService.getSplitWalletSecret(wallet) : null;
        };

        factory.setUnixDate = function (contract) {
            var dateArr = contract.expires.split('/');
            var unixExpiry = new Date(dateArr[2], dateArr[1], dateArr[0]).getTime() / 1000;
            contract.expires = unixExpiry;
            contract.conditions[0].expires = unixExpiry;
        };

        return factory;
    };

    contractFactory.$inject = injectParams;

    angular.module('superCrow').factory('contractService', contractFactory);

}());