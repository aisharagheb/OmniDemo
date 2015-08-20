four51.app.controller('Four51Ctrl', ['$window', '$scope', '$route', '$location', '$451', 'User', 'Order', 'Security', 'OrderConfig', 'Category', 'AppConst','XLATService','CategoryDisplayService', 'SpendingAccount',
function ($window, $scope, $route, $location, $451, User, Order, Security, OrderConfig, Category, AppConst, XLATService, CategoryDisplayService, SpendingAccount) {
	$scope.AppConst = AppConst;
	$scope.scroll = 0;
	$scope.isAnon = $451.isAnon; //need to know this before we have access to the user object
	$scope.Four51User = Security;
	if ($451.isAnon && !Security.isAuthenticated()) {
		User.login(function () {
			$route.reload();
		});
	}

	// fix Bootstrap fixed-top and fixed-bottom from jumping around on mobile input when virtual keyboard appears
	if ($(window).width() < 960) {
		$(document)
			.on('focus', ':input:not("button")', function (e) {
				$('.navbar-fixed-bottom, .headroom.navbar-fixed-top').css("position", "relative");
			})
			.on('blur', ':input', function (e) {
				$('.navbar-fixed-bottom, .headroom.navbar-fixed-top').css("position", "fixed");
			});
	}
	var pageViews;
	var maxPageViews;
	$scope.$watch('user.CustomFields', function(newVal){
		if(!newVal) return;
		angular.forEach($scope.user.CustomFields, function (field) {
			if (field.Name === 'ExpressPageViews') {
				pageViews = field;
				if (pageViews.Value === null) {
					pageViews.Value = 0;
					User.save($scope.user, function () {
						//do nothing
					});
				}
				else {
					pageViews.Value = parseInt(pageViews.Value);
				}
			}
			if (field.Name === 'MaxExpressPageViews') {
				maxPageViews = field;
				maxPageViews.Value = parseInt(field.DefaultValue);
			}
		});
		if ($location.url().indexOf('precartmessage') > -1) {
			pageViews.Value++;
			User.save($scope.user, function () {
				//do nothing
			});
		}
	});


	function init() {
		if (Security.isAuthenticated()) {
			User.get(function (user) {
				$scope.user = user;
                $scope.user.Culture.CurrencyPrefix = XLATService.getCurrentLanguage(user.CultureUI, user.Culture.Name)[1];
                $scope.user.Culture.DateFormat = XLATService.getCurrentLanguage(user.CultureUI, user.Culture.Name)[2];

	            if (!$scope.user.TermsAccepted)
		            $location.path('conditions');

				if (user.CurrentOrderID) {
					Order.get(user.CurrentOrderID, function (ordr) {
						$scope.currentOrder = ordr;
						OrderConfig.costcenter(ordr, user);
					});
				}
				else
					$scope.currentOrder = null;

                SpendingAccount.query(function(data) {
                    $scope.SpendingAccounts = data;
                });

				analytics(user.Company.GoogleAnalyticsCode);
			});
			Category.tree(function (data) {
				CategoryDisplayService.analyzeTree(data, function(analyzedTree) {
					$scope.tree = analyzedTree;
					$scope.$broadcast("treeComplete", analyzedTree);
				});
			});
		}
	}

	function analytics(id) {
		if (id.length == 0 || window.ga) return;
		(function (i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function () {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date();
			a = s.createElement(o),
				m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

		ga('create', id, 'four51.com');
		ga('require', 'ecommerce', 'ecommerce.js');
	}

	try {
		trackJs.configure({
			trackAjaxFail: false
		});
	}
	catch(ex) {}

    $scope.errorSection = '';

    function cleanup() {
        Security.clear();
    }

    $scope.$on('event:auth-loginConfirmed', function(){
        $route.reload();
	});
	$scope.$on("$routeChangeSuccess", init);
    $scope.$on('event:auth-loginRequired', cleanup);

    $scope.goToTop = function() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    };

    $scope.validateEmail = function(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@((expresspros)+\.)+(com)+$/;
        return regex.test(email);
    };



    $scope.showScrollUp = false;
    angular.element($window).bind("scroll", function(e) {
        if (e.view && e.view.scrollY > 250) {
            $scope.showScrollUp = true;
        } else {
            $scope.showScrollUp = false;
        }
        $scope.$apply();
    });


}]);