four51.app.controller('ProductCtrl', ['$scope', '$routeParams', '$route', '$location', '$451', 'Product', 'ProductDisplayService', 'Order', 'Variant', 'User', 'Browser',
function ($scope, $routeParams, $route, $location, $451, Product, ProductDisplayService, Order, Variant, User, Browser) {
    $scope.selected = 1;
    $scope.LineItem = {};
	$scope.addToOrderText = "Add To Cart";
	$scope.loadingIndicator = true;
	$scope.loadingImage = true;
	$scope.searchTerm = null;
	$scope.settings = {
		currentPage: 1,
		pageSize: 10
	};

	$scope.numSpecs = 0;
	$scope.$watch('StaticSpecGroups.Download.Specs', function(newVal) {
		if (!newVal) return;
		angular.forEach($scope.StaticSpecGroups.Download.Specs, function(spec) {
			$scope.numSpecs++;
		})
	});

    $scope.showLightbox = false;
    $scope.defaultIndex = 0;
    $scope.toggleLightbox = function(value){
        if (value) {
            $scope.showLightbox = value;
        } else {
            $scope.showLightbox = !$scope.showLightbox;
        }
    };
    $scope.changeDefaultIndex = function(value){
        if (value == 'next'){
            if ($scope.defaultIndex == ($scope.GalleryLightboxImages.Images.length - 1)){
                $scope.defaultIndex = 0;
            } else {
                $scope.defaultIndex++;
            }
        }
        if (value == 'prev'){
            if ($scope.defaultIndex == 0){
                $scope.defaultIndex = ($scope.GalleryLightboxImages.Images.length - 1);
            } else {
                $scope.defaultIndex--;
            }
        }
    };

	$scope.calcVariantLineItems = function(i){
		$scope.variantLineItemsOrderTotal = 0;
		angular.forEach($scope.variantLineItems, function(item){
			$scope.variantLineItemsOrderTotal += item.LineTotal || 0;
		})
	};
    function setDefaultQty(lineitem) {
        /*if (lineitem.PriceSchedule && lineitem.PriceSchedule.DefaultQuantity != 0)
         $scope.LineItem.Quantity = lineitem.PriceSchedule.DefaultQuantity;*/
        /*PW-14299 PDT: default qty input to 1*/
        if (lineitem.PriceSchedule && lineitem.PriceSchedule.DefaultQuantity !== 0) {
            $scope.LineItem.Quantity = lineitem.PriceSchedule.DefaultQuantity;
        }
        else if(lineitem.PriceSchedule.RestrictedQuantity === false) {
            $scope.LineItem.Quantity = null;
        }
	}
	function init(searchTerm, callback) {
		ProductDisplayService.getProductAndVariant($routeParams.productInteropID, $routeParams.variantInteropID, function (data) {
			$scope.LineItem.Product = data.product;
			$scope.LineItem.Variant = data.variant;
			ProductDisplayService.setNewLineItemScope($scope);
			ProductDisplayService.setProductViewScope($scope);
			setDefaultQty($scope.LineItem);
            $scope.$broadcast('ProductGetComplete');
			$scope.loadingIndicator = false;
			$scope.setAddToOrderErrors();
			if (angular.isFunction(callback))
				callback();
		}, $scope.settings.currentPage, $scope.settings.pageSize, searchTerm);
	}
	$scope.$watch('settings.currentPage', function(n, o) {
		if (n != o || (n == 1 && o == 1))
			init($scope.searchTerm);
	});

	$scope.searchVariants = function(searchTerm) {
		$scope.searchTerm = searchTerm;
		$scope.settings.currentPage == 1 ?
			init(searchTerm) :
			$scope.settings.currentPage = 1;
	};

	$scope.deleteVariant = function(v, redirect) {
		if (!v.IsMpowerVariant) return;
		// doing this because at times the variant is a large amount of data and not necessary to send all that.
		var d = {
			"ProductInteropID": $scope.LineItem.Product.InteropID,
			"InteropID": v.InteropID
		};
		Variant.delete(d,
			function() {
				redirect ? $location.path('/product/' + $scope.LineItem.Product.InteropID) : $route.reload();
			},
			function(ex) {
				$scope.lineItemErrors.push(ex.Message);
				$scope.showAddToCartErrors = true;
			}
		);
	}

	$scope.addToOrder = function(){
        $scope.actionMessage = null;
		if($scope.lineItemErrors && $scope.lineItemErrors.length){
			$scope.showAddToCartErrors = true;
			return;
		}
		if(!$scope.currentOrder){
			$scope.currentOrder = { };
			$scope.currentOrder.LineItems = [];
		}
        var quantity = "0";
		if (!$scope.currentOrder.LineItems)
			$scope.currentOrder.LineItems = [];
		if($scope.allowAddFromVariantList){
			angular.forEach($scope.variantLineItems, function(item){
				if(item.Quantity > 0){
					$scope.currentOrder.LineItems.push(item);
					$scope.currentOrder.Type = item.PriceSchedule.OrderType;
                    quantity = item.Quantity;
				}
			});
		}else{
            var lineItem = angular.copy($scope.LineItem);
			$scope.currentOrder.LineItems.push(lineItem);
			$scope.currentOrder.Type = $scope.LineItem.PriceSchedule.OrderType;
            quantity = $scope.LineItem.Quantity;
		}
		$scope.addToOrderIndicator = true;
		//$scope.currentOrder.Type = (!$scope.LineItem.Product.IsVariantLevelInventory && $scope.variantLineItems) ? $scope.variantLineItems[$scope.LineItem.Product.Variants[0].InteropID].PriceSchedule.OrderType : $scope.LineItem.PriceSchedule.OrderType;
		// shipper rates are not recalcuated when a line item is added. clearing out the shipper to force new selection, like 1.0
		Order.clearshipping($scope.currentOrder).
			save($scope.currentOrder, function(o){
				$scope.user.CurrentOrderID = o.ID;
                $scope.currentOrder = o;
				User.save($scope.user, function(){
					$scope.addToOrderIndicator = false;
                    $scope.actionMessage = quantity + " " + (+(quantity) > 1 ? 'items' : 'item') + " added to your cart.";
					$scope.LineItem.Quantity = null;
                    $scope.LineItem.LineTotal = null;
					$scope.TotalQty = quantity;
                    if (Browser.msie && Browser.version <= 9) {
                        alert(quantity + " " + (+(quantity) > 1 ? 'items' : 'item') + " added to your cart.");
                    }

				});
			},
				function(ex) {
					$scope.addToOrderIndicator = false;
					$scope.lineItemErrors.push(ex.Detail);
					$scope.showAddToCartErrors = true;
					//$route.reload();
				}
		);
	};

	$scope.setOrderType = function(type) {
		$scope.loadingIndicator = true;
		$scope.currentOrder = { 'Type': type };
		init(null, function() {
			$scope.loadingIndicator = false;
		});
	};

	$scope.$on('event:imageLoaded', function(event, result) {
		$scope.loadingImage = false;
		$scope.$apply();
	});
}]);