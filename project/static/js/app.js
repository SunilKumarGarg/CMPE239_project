(function(){
var app = angular.module('WeatherAnalysis',['ngRoute']);

app.config(function($routeProvider){
  $routeProvider

  .when('/Home',{
    templateUrl : "/static/Home.html",
    controller : 'DataController'
  })
  
  .when('/Analysis',{
    templateUrl : '/static/Analysis.html',
    controller : 'DataController'
  })
  
  .otherwise({redirectTo: '/'})
});

app.controller("DataController", function($scope, Service , $timeout){

  $scope.CityAvgTempData=[];

  $scope.$watch( Service.CityAvgTempData, function ( ) 
  {
      $scope.CityAvgTempData = Service.returnCityAvgTempData();
      console.log("This is me:" + $scope.CityAvgTempData)
  });
  

 $scope.getCityAvgTempData = function()
 {
   console.log("This is get function:");
 	Service.getCityAvgTempData();
 }
 

});

app.factory( 'Service', function($http) { 

  var CityAvgTempData=[];

  

  return {

      getCityAvgTempData: function()
        {
          $http.get("http://127.0.0.1:5000/AvgMonthTemp").then(function successCallback(response) 
          {            
            // RailWreckStateData = JSON.stringify(response.data);
            CityAvgTempData = response.data;
            console.log(response);
            
            }, function successCallback(response) 
            {
              alert("Server has some problem. Please try after sometime.");
            })
        },

        returnCityAvgTempData:function()
        {
          return CityAvgTempData;
        },      
      };
});

})();