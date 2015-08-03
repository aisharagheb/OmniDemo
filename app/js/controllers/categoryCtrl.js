four51.app.controller('CategoryCtrl', ['$routeParams', '$sce', '$scope', '$451', 'Category', 'Product', 'Nav',
function ($routeParams, $sce, $scope, $451, Category, Product, Nav) {
    $scope.productListType = 'inline';
	$scope.productLoadingIndicator = true;
	$scope.settings = {
		currentPage: 1,
		pageSize: 40
	};
	$scope.trusted = function(d){
		if(d) return $sce.trustAsHtml(d);
	}

	function _search() {
		$scope.searchLoading = true;
		Product.search($routeParams.categoryInteropID, null, null, function (products, count) {
			$scope.products = products;
			$scope.productCount = count;
			$scope.productLoadingIndicator = false;
			$scope.searchLoading = false;
		}, $scope.settings.currentPage, $scope.settings.pageSize);
	}

	$scope.$watch('settings.currentPage', function(n, o) {
		if (n != o || (n == 1 && o == 1))
			_search();
	});

	if ($routeParams.categoryInteropID) {
	    $scope.categoryLoadingIndicator = true;
        Category.get($routeParams.categoryInteropID, function(cat) {
            $scope.currentCategory = cat;
	        $scope.categoryLoadingIndicator = false;
        });
    }
	else if($scope.tree){
		$scope.currentCategory ={SubCategories:$scope.tree};
	}


	$scope.$on("treeComplete", function(data){
		if (!$routeParams.categoryInteropID) {
			$scope.currentCategory ={SubCategories:$scope.tree};
		}
	});

    /* BREADCRUMBS */
    $scope.linkedTree = {};
    $scope.breadcrumbs = [];
    $scope.$watch('currentCategory', function(newVal) {
        if (!newVal) return;
        $scope.breadcrumbs = [];
        initTree();
        getNode($scope.linkedTree, $scope.currentCategory, $scope.breadcrumbs);
    });
    function initTree() {
        $scope.linkedTree.Description = '';
        $scope.linkedTree.Image = null;
        $scope.linkedTree.Name = 'Catalog';
        $scope.linkedTree.ProductViewName = null;
        $scope.linkedTree.SortOptions = null;
        $scope.linkedTree.InteropID = 'catalog';
        $scope.linkedTree.Parent = null;
        $scope.linkedTree.SubCategories = $scope.tree;
        linkTree($scope.linkedTree.SubCategories, $scope.linkedTree);
    }
    function linkTree(currentNodes, parentNode) {
        if (currentNodes) {
            angular.forEach(currentNodes, function(node) {
                node.Parent = parentNode;
                linkTree(node.SubCategories, node);
            });
        }
    }
    function getNode(currentNode, node, breadcrumbs) {
        if (currentNode.InteropID === node.InteropID) {
            getBreadCrumbs(currentNode, breadcrumbs);
        }
        else if (currentNode.SubCategories) {
            angular.forEach(currentNode.SubCategories, function(cat) {
                getNode(cat, node, breadcrumbs);
            });
        }
    }
    function getBreadCrumbs(node, breadcrumbs) {
        if (node) {
            var linkPath;
            if (node.InteropID !== 'catalog') {
                linkPath = 'catalog/' + node.InteropID;
            } else {
                linkPath = node.InteropID;
            }
            breadcrumbs.unshift({name: node.Name, link: linkPath});
            getBreadCrumbs(node.Parent, breadcrumbs);
        }
    }

    // panel-nav
    $scope.navStatus = Nav.status;
    $scope.toggleNav = Nav.toggle;
	$scope.$watch('sort', function(s) {
		if (!s) return;
		(s.indexOf('Price') > -1) ?
			$scope.sorter = 'StandardPriceSchedule.PriceBreaks[0].Price' :
			$scope.sorter = s.replace(' DESC', "");
		$scope.direction = s.indexOf('DESC') > -1;
	});

    $scope.$on('event:orderUpdate', function(event, order) {
        $scope.currentOrder = order;
    });
}]);