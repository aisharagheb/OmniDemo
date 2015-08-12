four51.app
    .directive('ffoCarousel', function() {
        return {
            scope: {
                indicators: '=',
                timeout: '=',
                controls: '='
            },
            restrict: 'E',
            templateUrl: 'partials/controls/ffoCarousel.html',
            controller: 'ffoCarouselCtrl'
        }
    })
    .controller('ffoCarouselCtrl', ['$scope', 'Security', 'User', function($scope, Security, User){
        $scope.showCarousel = false;

        $scope.hostName = window.location.hostname;

        $scope.AuthToken = Security.auth();

        User.get(function(user) {
            $scope.Slides = [];
            angular.forEach(user.CustomFields, function(f) {
                if (f.Name.indexOf('carouselImage') > -1) {
                    var s = {
                        'imageUrl': f.File.Url,
                        'linkUrl': f.Label == 'none' ? null : f.Label,
                        'externalLink': f.Label.indexOf('http') > -1,
                        'cmsLink': f.Label.indexOf('cms') > -1 ? $scope.$eval(f.Label, $scope.AuthToken).toString() : 'none'
                    };
                    $scope.Slides.push(s);
                }
            });
            $scope.showCarousel = $scope.Slides.length > 1;
        })
    }])
;
