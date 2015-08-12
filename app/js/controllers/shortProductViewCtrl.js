four51.app.controller('shortProductViewCtrl', ['$routeParams', '$scope', 'ProductDisplayService', 'Order', 'User', '$location', '$route', 'Security',
    function ($routeParams, $scope, ProductDisplayService, Order, User, $location, $route, Security) {
        $scope.LineItem = {};
        $scope.LineItem.Product = $scope.p;
        ProductDisplayService.setNewLineItemScope($scope);
        ProductDisplayService.setProductViewScope($scope);



        $scope.allowAddToOrderInProductList = $scope.allowAddToOrder && $scope.LineItem.Product.Type != 'VariableText' && $scope.LineItem.Product.SpecCount == 0;
        //Product List Add to Order Functionality
        $scope.addToOrder = function(){
            $scope.displayLoadingIndicator = true;
            $scope.actionMessage = null;
            $scope.errorMessage = null;
            $scope.user.CurrentOrderID ? addLineItemToCurrentOrder() : addLineItemToNewOrder();
        };

        $scope.$watch('LineItem.Quantity', function(newVal){
            if ($scope.list){
                var isInCart = false;
                angular.forEach($scope.list, function(item){
                    if (item.Product.InteropID === $scope.LineItem.Product.InteropID){
                        isInCart = true;
                        if (!newVal || newVal <= 0){
                            $scope.list.splice($scope.list.indexOf(item), 1);
                        }
                        else {
                            item.Quantity = newVal;
                        }
                    }
                });
                if (!isInCart && newVal > 0){
                    $scope.list.push($scope.LineItem);
                }
            }
        });

        $scope.AuthToken = Security.auth();
}]);