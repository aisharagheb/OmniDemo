four51.app.factory('BonusItem', ['$451','$resource','User','Product', function($451,$resource, User, Product) {
	function _then(fn, data) {
		if (angular.isFunction(fn))
			fn(data);
	}

	var threshold, bonusProductID, bonusLineItem;
	User.get(function(user) {
		angular.forEach(user.CustomFields, function(f) {
			switch (f.Name) {
				case'FreeProductThreshold':
					threshold = +(f.DefaultValue);
					break;
				case'FreeProductAPI_ID':
					bonusProductID = f.DefaultValue || null;
					if (bonusProductID) {
						Product.get(bonusProductID, function(p){
							bonusLineItem = {
								Product: p,
								PriceSchedule: p.StandardPriceSchedule,
								Quantity: 1,
								Specs: {}
							};
						});
					}
					break;
				default:
					break;
			}
		});
	});

	function findFreeProduct(order) {
		if (order) {
            var item = null;
            var total = 0;

            angular.forEach(order.LineItems, function(lineitem) {
                if (lineitem.Product.InteropID == bonusProductID) {
                    item = lineitem;
                }
                total += lineitem.LineTotal;
            });

            return {Item: item, Total: total, Threshold: threshold};
        }
        else {
            return {Item:null, Total: null, Threshold: null};
        }
	}

    var _analyze = function(order, success, error) {
		var found = false;
		var pseudoTotal = 0;
		var bonusItem = null;
		/*angular.forEach(order.LineItems, function(li){
			if (li.Product.InteropID == bonusProductID) {
				found = true;
				bonusLineItemID = li.ID;
			}
			pseudoTotal += li.LineTotal;
		});*/
		var freeProductResult = findFreeProduct(order);
		found = freeProductResult.Item;
		bonusItem = freeProductResult.Item;
		pseudoTotal = freeProductResult.Total;
		if (pseudoTotal >= threshold && !found && bonusLineItem) {
			//console.log('ADD FREE ITEM TO CART');
			if (bonusLineItem.Product.QuantityAvailable > 0) order.LineItems.push(bonusLineItem);
			_then(success, order);
		} else if (pseudoTotal < threshold && found) {
			//console.log('REMOVE FREE ITEM FROM CART');
			$resource($451.api('order')).save(order).$promise.then(
				function(ord) {
					$resource($451.api('order/:id/lineitem/:lineitemid'), {'id': ord.ID, 'lineitemid': bonusItem.ID }, { lineitemdelete: { method: 'DELETE'}}).lineitemdelete().$promise.then(
						function(o) {
							if (o.ID) {
								_then(success, o);
							} else {
								_then(success, null);
							}
						},
						function(ex) {
							error(Error.format(ex));
						}
					);
				},
				function(ex) {
					error(Error.format(ex));
				}
			);
		} else {
			//console.log('THRESHOLD NOT MET AND ITEM HAS NOT BEEN ADDED');
			_then(success, order);
		}
	};

    return {
        analyze: _analyze,
		findfreeproduct: findFreeProduct
    };
}]);