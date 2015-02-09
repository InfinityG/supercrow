//Used for form validation
(function () {
    var modal = function () {
        return {
            restrict: 'E',
            replace: true,
            scope:{redirect:'='},
            controller: 'ModalController',
            template: '<div ui-content-for="modals">' +
            '<div class="modal" ng-if="show">' +
            '<div class="modal-backdrop in">' +
            '</div>' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button class="close"ng-click="cancelModal();">&times;</button>' +
            '<h4 class="modal-title">{{type}}</h4>' +
            '</div>' +
            '<div class="modal-body"> ' +
            '<p>{{message}}</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button ng-click="cancelModal();" class="btn btn-default">Close</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        };
    };

    angular.module('superCrow').directive('modal', modal);
})();