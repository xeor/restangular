(function() {
    angular.module('restangular').factory('RestangularResourceGenerator', function() {
        return function(config, urlhandler) {

            // Main constructions
            function RestangularResource(route, parent) {
                this._setField('route', route);
                this._setParent(parent);
            }

            function RestangularElement(route, parent) {
                RestangularResource.apply(this, arguments)
            }

            function RestangularCollection(route, parent) {
                RestangularResource.apply(this, arguments)
            }

            // Restangular resource prototype

            RestangularResource.prototype._setField = function(name, value) {
                this[config.restangularFields[name]] = value;
            }

            RestangularResource.prototype._setParent = function(parent) {
                if (parent && config.shouldSaveParent(route)) {
                      var parentId = config.getIdFromElem(parent);
                      var parentUrl = config.getUrlFromElem(parent);

                      var restangularFieldsForParent = _.union(
                        _.values( _.pick(config.restangularFields, ['route', 'parentResource']) ),
                        config.extraFields
                      );
                      var parentResource = _.pick(parent, restangularFieldsForParent);

                      if (config.isValidId(parentId)) {
                          config.setIdToElem(parentResource, parentId);
                      }
                      if (config.isValidId(parentUrl)) {
                          config.setUrlToElem(parentResource, parentUrl);
                      }

                      this[config.restangularFields.parentResource] = parentResource;
                  } else {
                    this[config.restangularFields.parentResource] = null;
                  }
            }

            RestangularResource.prototype.isCollection = function() {
                return !!this[config.restangularFields.restangularCollection];
            }            

            RestangularResource.prototype[config.restangularFields.getRestangularUrl] = 
                function(name, value) {
                    return urlHandler.fetchUrl(this);
                }

            // TODO: No addRestangularMethod

            RestangularResource.prototype[config.restangularFields.clone] = 
                function() {
                    return angular.copy(this);
                }
            
            RestangularResource.prototype.withHttpConfig = 
                function(httpConfig) {
                    this.setField('httpConfig', httpConfig);
                    return this;
                }


            RestangularResource.prototype.one = 
                function(route, id) {
                    var elem = new RestangularElement(route, this);
                    elem.setId(id);
                    return elem;
                }
            RestangularResource.prototype.all = 
                function(route) {
                    return new RestangularCollection(route, this);
                }
            RestangularResource.prototype.several = 
                function(route /*, ids*/) {
                    var ids = Array.prototype.splice.call(arguments, 2);
                    var collection = new RestangularCollection(route, this);
                    collection.setIds(ids);
                    return collection;
                }

            RestangularResource.prototype.oneUrl = 
                function(route, url) {
                    var elem = new RestangularElement(route, this);
                    elem.setUrl(id);
                    return elem;
                }

            RestangularResource.prototype.allUrl = 
                function(route, url) {
                    var elem = new RestangularCollection(route, this);
                    elem.setUrl(id);
                    return elem;
                }

            Restangular



        }
    });
})();