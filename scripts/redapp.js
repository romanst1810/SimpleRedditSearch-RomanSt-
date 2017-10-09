(function () {
    var app = angular.module('red-app', []);
    app.controller('redditController',
       function redditController($scope) {
           $scope.limitItemsPerReq = 10;
           $scope.searchString = "";
           $scope.curentItemsArray = [];
           $scope.beforeName = "";      // image first
           $scope.afterName = "";       // image last
           $scope.countOfPage = 0;      // count of pages
           $scope.prevBtnDisabled = true;   // for using before btn use limit before count
           $scope.nextBtnDisabled = true;   // for using next btn use limit after count
           $scope.countAfterBefore = 0;
           $scope.BtnSearch = function (searchStr) {
               $scope.SearchItems(searchStr, $scope.limitItemsPerReq);
           }

           $scope.NextBtnSearch = function (searchStr) {
               $scope.SearchItemsAfter(searchStr, $scope.limitItemsPerReq, $scope.afterName, $scope.countAfterBefore);
           }

           $scope.PrevBtnSearch = function (searchStr) {
               $scope.SearchItemsBefore(searchStr, $scope.limitItemsPerReq, $scope.beforeName, $scope.countAfterBefore);
           }

           // Service methods
           $scope.SearchItems = function (searchStr, limit) {
               $scope.searchString = searchStr;
               reddit.search($scope.searchString).t("all").limit(limit).fetch(function (res) {
                   $scope.FillItemsToArray(res);
               });
               $scope.countAfterBefore = 0;
               $scope.countOfPage = 0;
               $scope.nextBtnDisabled = false;
               $scope.prevBtnDisabled = true;
           }

           $scope.SearchItemsAfter = function (searchStr, limit, after, count) {
               $scope.nextBtnDisabled = true;
               $scope.searchString = searchStr;
               reddit.search($scope.searchString).t("all").limit(limit).after(after).count(count).fetch(function (res) {
                   $scope.FillItemsToArray(res);
               });
               $scope.countAfterBefore += limit;
               $scope.countOfPage++;
               $scope.prevBtnDisabled = false;
               $scope.nextBtnDisabled = false;
           }

           $scope.SearchItemsBefore = function (searchStr, limit, before, count) {
               $scope.prevBtnDisabled = true;
               $scope.searchString = searchStr;
               reddit.search($scope.searchString).t("all").limit(limit).before(before).count(count).fetch(function (res) {
                   $scope.FillItemsToArray(res);
               });
               if ($scope.countOfPage > 0) {
                   $scope.countOfPage--;
                   $scope.countAfterBefore -= limit;
               }
               if ($scope.countOfPage === 0) {
                   $scope.prevBtnDisabled = true;
               } else {
                   $scope.prevBtnDisabled = false;
               }
           }

           $scope.GetTopItems = function (limit) {
               reddit.top("aww").t("day").limit(limit).fetch(function (res) {
                   $scope.FillItemsToArray(res);
               });
           };

           $scope.FillItemsToArray = function (result) {
               $scope.curentItemsArray = [];
               $scope.beforeName = result.data.before;
               $scope.afterName = result.data.after;
               for (var i = 0; i < result.data.children.length; i++) {
                   var resultItemData = result.data.children[i].data;
                   if (resultItemData.post_hint === "image") {
                       $scope.curentItemsArray.push(resultItemData);
                   }
               }
               $scope.$apply();
           }

           $scope.GetTopItems($scope.limitItemsPerReq);
       });
}());