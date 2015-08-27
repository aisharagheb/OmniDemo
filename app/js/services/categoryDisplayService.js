four51.app.factory('CategoryDisplayService', function() {
	var _analyzeTree = function(node, success) {
		angular.forEach(node, function(topcategory) {
			topcategory.Featured = true;
			analyzeSubs(topcategory);
		});

		function analyzeSubs(cat) {
			cat.Featured = cat.Featured ? cat.Featured : cat.InteropID.indexOf('--Featured') > -1;
			angular.forEach(cat.SubCategories, function(subcategory) {
				analyzeSubs(subcategory);
			});
		}
		success(node);
	};

	return {
		analyzeTree: _analyzeTree
	};
});

four51.app.directive('categorylisttree', function() {
	var obj = {
		restrict: 'E',
		replace: true,
		scope: {
			tree: '=',
			current: '='
		},
		templateUrl: 'partials/categoryListTree.html'
	};
	return obj;
});

four51.app.directive('categorylistnode', ['$compile', function($compile) {
	var obj = {
		restrict: 'E',
		replace: true,
		scope: {
			node: '=',
			current: '='
		},
		template: '<li class="451_cat_item" ng-class="{\'active\':  current.InteropID == node.InteropID}"><a ng-href="catalog/{{node.InteropID}}" ng-bind-html="node.Name | categoryNames"></a></li>',
		link: function(scope, element) {
			if (angular.isArray(scope.node.SubCategories)) {
				element.append("<categorylisttree tree='node.SubCategories' current='current'/>");
				$compile(element.contents())(scope);
			}
		}
	};
	return obj;
}]);