four51.app.factory('WebMerge', ['$resource', '$http', function($resource, $http) {
    var service = {
        create: _create
    };
    return service;

    function _create(specs, user) {
        var url = "https://www.webmerge.me/merge/" + specs.WebMerge.DefaultValue;
        
        var form = {};
        angular.forEach(specs, function(spec) {
            if (spec.Name != 'WebMerge') {
                form[spec.Name] = spec.Value;
            }
        });
        form['email'] = user.Email;
        form['EMAIL'] = user.Email;
        form['Email'] = user.Email;

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