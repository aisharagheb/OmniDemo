//four51.app.directive('ocmaskfield', function() {
//    var directive = {
//        scope: {
//            customfield : '=',
//            changed: '=',
//            hidesuffix: '@',
//            hideprefix: '@',
//            mask: '@'
//        },
//        restrict: 'E',
//        template: template
//    };
//    return directive;
//
//    function template() {
//        return [
//            '<div class="view-form-icon" ng-class="{\'view-form-icon-input-group\':((customfield.Prefix && !hideprefix) || (customfield.Suffix && !hidesuffix))}">',
//            '<div ng-if="customfield.Lines <= 1">',
//            '<label>{{customfield.Label || customfield.Name}}</label>',
//            '<div ng-class="{\'input-group\':((customfield.Prefix && !hideprefix) || (customfield.Suffix && !hidesuffix))}">',
//            '<span class="input-group-addon" ng-if="customfield.Prefix && !hideprefix && !((customfield.Prefix) == \'\')">{{customfield.Prefix}}</span>',
//            '<input class="form-control" size="{{customfield.Width * .13}}" ng-maxlength="{{customfield.MaxLength}}" mask="{{customfield.MaskedInput || mask}}" type="text" autocomplete="off" ng-required="{{customfield.Required}}" ng-model="customfield.Value"></input>',
//            '<span class="input-group-addon" ng-if="customfield.Suffix && !hidesuffix && !((customfield.Suffix) == \'\')">{{customfield.Suffix}}</span>',
//            '</div>',
//            '</div>',
//            '</div>'
//        ].join('');
//    }
//});
//
//four51.app.directive('mask', function() {
//    var directive = {
//        restrict: 'A',
//        link: link
//    };
//    return directive;
//
//    function link(scope, elem, attr, ctrl) {
//        if (attr.mask)
//            elem.mask(attr.mask, { placeholder: attr.maskPlaceholder });
//    }
//});
//
//
