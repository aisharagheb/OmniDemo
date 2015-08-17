/**
 * Created by mirandaposthumus on 6/26/15.
 */

angular.module('OrderCloud-ProductListAddToCart', []);

angular.module('OrderCloud-ProductListAddToCart')
    .directive('productlistaddtocart', productlistaddtocart)
    .controller('ProductListAddToCartCtrl', ProductListAddToCartCtrl)
;

function productlistaddtocart() {
    var directive = {
        restrict: 'E',
        template: template,
        controller: 'ProductListAddToCartCtrl'
    };
    return directive;

    function template() {
        return [
            '<form name="addToOrderForm" ng-submit="addToOrder()">',
                '<div class="view-form-icon" ng-show="allowAddToOrderInProductList">',
                    '<div class="row">',
                        '<div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">',
                            //'<label class="required">{{\'Quantity\' | r | xlat}}</label>',
                            '<quantityfield required="true" calculated="calcVariantLineItems" lineitem="LineItem" class="quantity"/>',
                        '</div>',
                        '<div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">',
                            '<button style="height:52px; font-size: 200%;" class="btn btn-default btn-block btn-md" type="submit" ng-disabled="addToOrderForm.$invalid">',
                                '<loadingindicator  ng-show="displayLoadingIndicator" />',
                                //'<i ng-show="lineItemErrors.length > 0" class="fa fa-warning" style="left: 0px;"></i>',
                                '<i ng-show="lineItemErrors.length > 0" class="fa fa-shopping-cart" style="left: 0px; color: #aaaaaa;"></i>',
                                '<i ng-show="lineItemErrors.length == 0" class="fa fa-shopping-cart" style="left: 0px; color: #0676ab;"></i>',
                            '</button>',
                        '</div>',
                    '</div>',
                '</div>',
            '</form>'
        ].join('');
    }
}

ProductListAddToCartCtrl.$inject = ['$scope', 'Order', 'User', '$timeout'];
function ProductListAddToCartCtrl($scope, Order, User, $timeout) {

    $scope.allowAddToOrderInProductList = $scope.allowAddToOrder && $scope.LineItem.Product.Type != 'VariableText' && $scope.LineItem.Product.SpecCount == 0;
    $scope.addToOrder = function(){
        $scope.displayLoadingIndicator = true;
        $scope.actionMessage = null;
        $scope.errorMessage = null;
        $scope.user.CurrentOrderID ? addLineItemToCurrentOrder() : addLineItemToNewOrder();
        $scope.displayLoadingIndicator = false;
    };
    var addLineItemToCurrentOrder = function(){
        Order.get($scope.user.CurrentOrderID, function(order){
            addToOrderSave(order);
        });
    };
    var addLineItemToNewOrder = function(){
        var currentOrder = {};
        currentOrder.LineItems = [];
        addToOrderSave(currentOrder);
    };
    var addToOrderSave = function(currentOrder){
        currentOrder.LineItems.push($scope.LineItem);
        Order.save(currentOrder,
            function(order, callback){
                $scope.user.CurrentOrderID = order.ID;
                $scope.LineItem.Product.QuantityAvailable = $scope.LineItem.Product.QuantityAvailable - $scope.LineItem.Quantity;
                User.save($scope.user, function(){
                    $scope.LineItem.Quantity = null;
                });
                if (callback) callback();
                $scope.actionMessage = 'Item has been added to your cart!';
                $timeout(function () {
                    $scope.actionMessage = null;
                }, 5000);
            },
            function (ex) {
                $scope.displayLoadingIndicator = false;
                $scope.errorMessage = ex.Message;
            }
        );
    };

}