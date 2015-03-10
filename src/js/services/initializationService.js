/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$rootScope', 'tokenService', 'blobService'];

    var configValue = {
        apiHost: 'http://localhost:9000',
        identityHost: 'http://localhost:9002',
        nacl: '9612700b954743e0b38f2faff35d264c'
    };

    var initializationFactory = function ($http, $rootScope, tokenService, blobService) {
        var factory = {};

        factory.init = function(){
            factory.start(null);
            factory.setupListener();
        };

        factory.start = function(key){
            var context = tokenService.getContext();

            if(context != null){
                factory.initializeAuthHeaders(context);
                factory.initializeBlob(key);
            }
        };

        factory.initializeAuthHeaders = function(context){
            $http.defaults.headers.common['Authorization'] = context.token;
            $http.defaults.withCredentials = true;
        };

        factory.initializeBlob = function(key){
            if(blobService.getBlob() == null) {
                var userBlob = blobService.getBlobTemplate(key);
                blobService.saveBlob(userBlob);
            }
        };

        //TODO: clean up $rootScope listeners
        factory.setupListener = function() {
            $rootScope.$on('loginEvent', function (event, args) {
                factory.start(args.key);
            });

            $rootScope.$on('registrationEvent', function (event, args) {
                factory.start(args.key);
            });
        };

        return factory;
    };

    initializationFactory.$inject = injectParams;

    angular.module('superCrow').value('config', configValue);
    angular.module('superCrow').factory('initializationService', initializationFactory);

}());