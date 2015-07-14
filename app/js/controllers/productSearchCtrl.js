four51.app.controller('ProductSearchCtrl', ['$scope', 'Product', '$routeParams', 'Order', 'User', '$location',
function($scope, Product, $routeParams, Order, User, $location) {
	$scope.settings = {
		currentPage: 1,
		pageSize: 40
	};

	$scope.searchTerm = $routeParams.searchTerm;
	$scope.search = Search;

	$scope.$watch('settings.currentPage', function(n, o) {
		if (n != o || (n == 1 && o == 1))
			Search();
	});

	function Search() {
		$scope.searchLoading = true;
		Product.search(null, $scope.searchTerm, null, function(products, count) {
			$scope.products = products;
			$scope.productCount = count;
			$scope.searchLoading = false;
		}, $scope.settings.currentPage, $scope.settings.pageSize);
	}

    $scope.$watch('sort', function(s) {
        if (!s) return;
        (s.indexOf('Price') > -1) ?
            $scope.sorter = 'StandardPriceSchedule.PriceBreaks[0].Price' :
            $scope.sorter = s.replace(' DESC', "");
        $scope.direction = s.indexOf('DESC') > -1;
    });

	$scope.list = [];

	//$scope.addListToOrder = function(){
	//	$scope.displayLoadingIndicator = true;
	//	angular.forEach($scope.list, function(item){
	//		addToOrder(item);
	//	});
	//	$scope.list = [];
	//	Order.clearshipping($scope.currentOrder).
	//		save($scope.currentOrder,
	//		function(o){
	//			$scope.user.CurrentOrderID = o.ID;
	//			User.save($scope.user, function(){
	//				$scope.addToOrderIndicator = true;
	//				$location.path('/cart');
	//			});
	//		},
	//		function(ex) {
	//			$scope.addToOrderIndicator = false;
	//			$scope.lineItemErrors.push(ex.Detail);
	//			$scope.showAddToCartErrors = true;
	//			//$route.reload();
	//		}
	//	);
	//}
    //
	//function addToOrder(item) {
	//	if($scope.lineItemErrors && $scope.lineItemErrors.length){
	//		$scope.showAddToCartErrors = true;
	//		return;
	//	}
	//	if(!$scope.currentOrder){
	//		$scope.currentOrder = { };
	//		$scope.currentOrder.LineItems = [];
	//	}
	//	if (!$scope.currentOrder.LineItems)
	//		$scope.currentOrder.LineItems = [];
	//	$scope.currentOrder.LineItems.push(item);
	//	$scope.currentOrder.Type = item.PriceSchedule.OrderType;
	//	$scope.addToOrderIndicator = true;
	//};
}]);