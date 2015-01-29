/**
 * Created by grant on 26/01/2015.
 */
/* based on pattern from: http://beletsky.net/2013/11/simple-authentication-in-angular-dot-js-app.html */

(function () {

    var injectParams = ['$q', '$window', '$location'];

    var httpInterceptor = function ($q, $window, $location) {

        return {
            'response': function (response) {
                // do something on success
                return response;
            },
            'responseError': function (rejection) {
                if(rejection.status === 401) {
                    //todo: delete old tokens here!
                    $location.path('/login');
                }

                return $q.reject(rejection);
            }
        };
    };

    httpInterceptor.$inject = injectParams;

    angular.module('superCrow').factory('httpInterceptor', httpInterceptor);

}());