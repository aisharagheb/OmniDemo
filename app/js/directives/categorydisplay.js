four51.app.directive('categorydisplay', function() {
    var obj = {
        scope: {
            categoryid : '='
        },
        restrict: 'E',
        templateUrl: 'partials/controls/categoryDisplay.html',
        controller: 'categoryDisplayCtrl'
    };
    return obj
});

four51.app.directive('categorydisplayInline', function() {
    var obj = {
        scope: {
            categoryid : '=',
            user : '='
        },
        restrict: 'E',
        templateUrl: 'partials/controls/categoryDisplayInline.html',
        controller: 'categoryDisplayCtrl'
    };
    return obj
});

four51.app.controller('categoryDisplayCtrl', ['$scope','CategoryDisplay','Category',
    function ($scope, CategoryDisplay, Category) {
        var catID = $scope.categoryid;
        Category.get(catID, function(cat){
            $scope.categoryDisplayLoading = true;
            $scope.category = cat;
            CategoryDisplay.get(catID, function(products, count) {
                $scope.category.products = products;
                $scope.category.productCount = count;
                $scope.categoryDisplayLoading = false;
            });
        });
    }
]);

four51.app.factory('CategoryDisplay', ['$resource', '$451', 'Security', 'User', function($resource, $451, Security, User) {
    function _then(fn, data, count) {
        if (angular.isFunction(fn))
            fn(data, count);
    }

    function _extend(product) {
        product.ViewName = product.ViewName || 'default';
        angular.forEach(product.Specs, function(spec) {
            if (spec.ControlType == 'File' && spec.File && spec.File.Url.indexOf('auth') == -1)
                spec.File.Url += "&auth=" + Security.auth();
        });

        angular.forEach(product.StaticSpecGroups, function(group) {
            angular.forEach(group.Specs, function(spec) {
                if (spec.FileURL && spec.FileURL.indexOf('auth') == -1)
                    spec.FileURL += "&auth=" + Security.auth();
            });
        });

        if(product.StaticSpecGroups){
            product.StaticSpecLength = 0;
            product.StaticSpecGroups.EvenSpecGroups = [];
            product.StaticSpecGroups.OddSpecGroups = [];
            angular.forEach(product.StaticSpecGroups, function(g){
                var visible = false;
                for (var i in g.Specs) {
                    if (g.Specs[i].VisibleToCustomer) {
                        visible = true;
                    }
                }
                if (visible) {
                    product.StaticSpecGroups.EvenSpecGroups.length == product.StaticSpecGroups.OddSpecGroups.length ? product.StaticSpecGroups.EvenSpecGroups.push(g) : product.StaticSpecGroups.OddSpecGroups.push(g);
                    product.StaticSpecLength++;
                }
            });
        }

        // parse old tokens to retrieve their values
        angular.forEach(product.Specs, function(spec) {
            if (spec.DefaultValue && spec.DefaultValue == spec.Value) {
                var matches = spec.DefaultValue.match(/\[\[(.*?)\]\]/g);
                if (matches) {
                    User.get(function (user) {
                        angular.forEach(matches, function(token) {
                            var fix = token.replace(/\[/g, '').replace(/\]/g, '').replace(/\[/g, '');
                            var split = fix.split(".");
                            var temp = null, value;
                            for(var i = 0; i <= split.length - 1; i++) {
                                temp = temp ? temp[split[i]] : user[split[i]];
                            }
                            value = temp || lookupCustom(user, fix);
                            spec.Value = spec.Value.replace(token, value).substr(0, spec.MaxLength);
                            spec.DefaultValue = spec.DefaultValue.replace(token, value);
                        });
                    });
                }
            }
        });
        function lookupCustom(user, token) {
            var value = '';
            angular.forEach(user.CustomFields, function(f) {
                if (f.Name == token)
                    value = f.Value;
            });
            return value;
        }
    }

    var _get = function(categoryInteropID, success) {
        var criteria = {
            'CategoryInteropID': categoryInteropID,
            'SearchTerms': null,
            'RelatedProductGroupID': null,
            'Page': 1,
            'PageSize': 100
        };

        $resource($451.api('Products')).get(criteria).$promise.then(function (products) {
            angular.forEach(products.List, _extend);
            _then(success, products.List, products.Count);
        });
    }

    return {
        get: _get
    }
}]);