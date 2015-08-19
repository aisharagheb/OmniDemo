four51.app.filter('onproperty', ['$451', function($451) {
	var defaults = {
		'OrderStats': 'Type',
		'Message': 'Box'
	};

	return function(input, query) {
		if (!input || input.length === 0) return;
		if (!query) return input;
		query.Property = query.Property || defaults[query.Model];
		return $451.filter(input, query);
	}
}]);

four51.app.filter('kb', function() {
	return function(value) {
		return isNaN(value) ? value : parseFloat(value) / 1024;
	}
});

four51.app.filter('r', ['$sce', 'WhiteLabel', function($sce, WhiteLabel) {
	return function(value) {
		var result = value, found = false;
		angular.forEach(WhiteLabel.replacements, function(c) {
			if (found) return;
			if (c.key == value) {
				result = $sce.trustAsHtml(c.value);
				found = true;
			}
		});
		return result;
	}
}]);

four51.app.filter('rc', ['$sce', 'WhiteLabel', function($sce, WhiteLabel) {
	return function(value) {
		var result = value, found = false;
		angular.forEach(WhiteLabel.replacements, function(c) {
			if (found) return;
			if (c.key.toLowerCase() == value.toLowerCase()) {
				result = $sce.trustAsHtml(c.value);
				found = true;
			}
		});
		return result;
	}
}]);

four51.app.filter('rl', ['$sce', 'WhiteLabel', function($sce, WhiteLabel) {
	return function(value) {
		var result = value, found = false;
		angular.forEach(WhiteLabel.replacements, function(c) {
			if (found) return;
			if (c.key.toLowerCase() == value.toLowerCase()) {
				result = $sce.trustAsHtml(c.value.toLowerCase());
				found = true;
			}
		});
		return result;
	}
}]);

four51.app.filter('noliverates', function() {
	return function(value) {
		var output = [];
		angular.forEach(value, function(v) {
			if (v.ShipperRateType != 'ActualRates')
				output.push(v);
		});
		return output;
	}
});

four51.app.filter('paginate', function() {
	return function(input, start) {
		if (typeof input != 'object' || !input) return;
		start = +start; //parse to int
		return input.slice(start);
	}
});

//CUSTOM ROBYN PROMO FILTERS

four51.app.filter('freeproducthide', ['User', function(User) {
	var freeProductID = null;
	User.get(function(u) {
		angular.forEach(u.CustomFields, function(f) {
			if (f.Name == "FreeProductAPI_ID") {
				freeProductID = (f.DefaultValue && f.DefaultValue != '') ? f.DefaultValue : null;
			}
		})
	});

	return function(lineitems) {
		var results = [];
		angular.forEach(lineitems, function(li) {
			if (li.Product.InteropID.indexOf(freeProductID) == -1) {
				results.push(li);
			}
		});
		return results;
	}
}]);

four51.app.filter('categoryNames', function() {
	return function(value) {
		var result = value.split('||')[0];
		return result;
	}
});

four51.app.filter('hiddencategories', function() {
    return function(categories) {
        var hiddenCategories = ['EX_LatestProducts', 'EX_BestProducts', 'EX_CommonSearchProducts'];
        var results = [];
        angular.forEach(categories, function(c) {
            if (hiddenCategories.indexOf(c.InteropID) == -1) {
                results.push(c);
            }
        });
        return results;
    }
});


four51.app.filter('hiddenspecgroups', function() {
    return function(specgroups) {
        var hiddenSpecGroups = ['images','Download'];
        var results = [];
        angular.forEach(specgroups, function(sg) {
            if (hiddenSpecGroups.indexOf(sg.Name) == -1) {
                results.push(sg);
            }
        });
        return results;
    }
});

four51.app.filter('dynamicspecs', function() {
    return function(staticSpecs, variableSpecs) {
        var results = [];
        if (!variableSpecs || !staticSpecs) return results;
        var language = (variableSpecs.Language && variableSpecs.Language.Value) ? variableSpecs.Language.Value : null;
        var state = (variableSpecs.State && variableSpecs.State.Value) ? variableSpecs.State.Value : null;

        if (language && !state) {
            angular.forEach(staticSpecs, function(s) {
                if (s.Name.indexOf(language) > -1 && s.Name.indexOf('Generic') == 0) {
                    results.push(s);
                }
            });
        }
        else if (language && state) {
            var stateFound = false;
            angular.forEach(staticSpecs, function(s) {
                if (s.Name.indexOf(language) > -1 && s.Name.indexOf(state) > -1) {
                    results.push(s);
                    stateFound = true;
                }
            });
            if (!stateFound) {
                angular.forEach(staticSpecs, function(s) {
                    if (s.Name.indexOf(language) > -1 && s.Name.indexOf('Generic') == 0) {
                        results.push(s);
                    }
                });
            }
        }
        else if (!language && state) {
            angular.forEach(staticSpecs, function(s) {
                if (s.Name.indexOf(state) > -1) {
                    results.push(s);
                }
            });
        }
        else {
            return results;
        }
        return results;
    }
});

four51.app.filter('dynamicspecs2', function() {
    return function(staticSpecs, variableSpecs) {
        var results = [];
        if (!variableSpecs || !staticSpecs) return results;
        var language = (variableSpecs.Language && variableSpecs.Language.Value) ? variableSpecs.Language.Value : null;
        var region = (variableSpecs.Region && variableSpecs.Region.Value) ? variableSpecs.Region.Value : null;

        if (language && !region) {
            angular.forEach(staticSpecs, function(s) {
                if (s.Name.indexOf(language) > -1 && s.Name.indexOf('Generic') == 0) {
                    results.push(s);
                }
            });
        }
        else if (language && region) {
            var regionFound = false;
            angular.forEach(staticSpecs, function(s) {
                if (s.Name.indexOf(language) > -1 && s.Name.indexOf(region) > -1) {
                    results.push(s);
                    regionFound = true;
                }
            });
            if (!regionFound) {
                angular.forEach(staticSpecs, function(s) {
                    if (s.Name.indexOf(language) > -1 && s.Name.indexOf('Generic') == 0) {
                        results.push(s);
                    }
                });
            }
        }
        else if (!language && region) {
            angular.forEach(staticSpecs, function(s) {
                if (s.Name.indexOf(region) > -1) {
                    results.push(s);
                }
            });
        }
        else {
            return results;
        }
        return results;
    }
});


four51.app.filter('filterbyspec', function() {
    return function(staticSpecs, specValue) {
        var results = [];
        if (!specValue) return results;
        angular.forEach(staticSpecs, function(s) {
            if (s.Name == specValue) {
                results.push(s);
            }
        });
        return results;
    }
});

four51.app.filter('specnametolabel', function() {
    return function(name, specs) {
        if (!name || !specs) return;
        var value = name;
        var specForm = false;
        if (value.indexOf('is a required field') > -1) {
            specForm = true;
            name.replace(' is a required field', '');
        }

        if (specs[value]) {
            value = specs[value].Label;
        }

        return value + (specForm ? ' is a required field' : '');
    }
});

four51.app.filter('groupOptionsFilter', function(){
    return function(options, groups){
        var result = [];
        var isInGroup = false;
        angular.forEach(groups, function(group){
            if (group.Name === 'CPSS'){
                isInGroup = true;
            }
        })
        if (isInGroup){
            //console.log('isInGroup');
            return options;
        }
        else {
            angular.forEach(options, function(option){
                if (option.Value !== 'CPSS Only' && option.Value !== 'CPSS and ISO' && option.Value !== 'CPSS and COE' && option.Value !== 'CPSS ISO and COE'){
                    result.push(option);
                }
            });
        }
        //console.log(result);
        return result;
    }
});
