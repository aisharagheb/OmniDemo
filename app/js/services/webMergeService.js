four51.app.factory('WebMerge', ['$resource', '$http', function($resource, $http) {
    var service = {
        create: _create
    };
    return service;

    function _create(specs, user) {
        var url = "https://www.webmerge.me/merge/12756/je8vzy?test=1";

        console.log(specs);

        var form = {};
        angular.forEach(specs, function(spec) {
            if (spec.Name != 'WebMerge') {
                form[spec.Name] = spec.Value;
            }
        });
        form['email'] = user.Email;

        $.ajax({
            url: url,
            data: form,
            type: 'POST',
            success: function(data) {
                console.log('success');
            },
            error: function(ex) {
                console.log('error');
            }
        });
    }
}]);