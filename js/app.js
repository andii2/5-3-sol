(function(){
  'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController',NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItems)
    ;

//directive
function FoundItems () {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    }
  //  controllerAs: 'menu'
  };
  return ddo;
};

//controller
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService) {
  var menu = this;

  menu.found = '';



  menu.getMatchedMenuItems = function (searchTerm) {
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
    promise.then(function(response){
      menu.found = response;
    });
  };

  //removeFoundItem function
  menu.removeFoundItem = function (foundItemIndex) {
    menu.found.splice(foundItemIndex,1);
    console.log("now I'm here");
  };

};

//service
MenuSearchService.$inject = ['$q','$http'];
function MenuSearchService($q, $http) {
  var service = this;


  service.getMatchedMenuItems = function (searchTerm) {
    //let's make it a promise
    var deferred = $q.defer();

    var promise = service.getMenuItems();
    //then
    promise.then (function (response) {
      var foundItems = new Array;
      var items = response.data.menu_items;
      for (var i=0; i < items.length; i++) {
          var name = items[i].name;
          if (name.toLowerCase().indexOf(searchTerm) !== -1) {
            foundItems.push(items[i]);
          };
      };
      deferred.resolve(foundItems);

    })
    //catch
    .catch(function (error){
      console.log("A very nasty error occured!");
    });
    return deferred.promise;
  };
  //
  service.getMenuItems = function() {
    var response = $http({
      method: "GET",
      url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
    });

    return response;
  };
  //
};


})();
