(function () {
  'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);


function FoundItemsDirective(){
    return {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'Terms',
      bindToController: true
    };
  }
  function FoundItemsDirectiveController() {
    var  Terms = this;
  }


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;

   menu.found = []
   menu.getResult = function () {
    MenuSearchService.getMatchedMenuItems(menu.searchTerm)
    .then(function (response) {
      menu.found = response;
    });
   }

  menu.removeItem = function (index) {
    menu.found.splice(index, 1);
  }
}

MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function(searchTerm) {
    return $http({
      method: "GET",
      url: (ApiBasePath + '/menu_items.json')
    }).then(function (result) {
        var foundItems = result.data.menu_items;
        foundItems = foundItems.filter(function (item) {
          if(searchTerm == '') {
            return false;
          }
          return item.description.includes(searchTerm);
        });

        // return processed items
        return foundItems;
    });
  }

}

})();
