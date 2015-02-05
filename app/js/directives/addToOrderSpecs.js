four51.app.directive('addtoorderspecs', ['$routeParams',  function($routeParams) {
	var obj = {
		restrict: 'E',
//		templateUrl: 'addToOrderSpecForm.hcf?id=' + $routeParams.productInteropID
		templateUrl: 'partials/detailSpecFormDEV.html'
	}
	return obj;
}]);