(function(){

google.load('visualization', '1', {packages: ['corechart']});

google.setOnLoadCallback(function() {
    angular.bootstrap(document.body, ['WeatherAnalysis']);
});

var app = angular.module('WeatherAnalysis',['ngRoute']);

app.config(function($routeProvider){
  $routeProvider  
  
  .when('/Analysis',{
    templateUrl : '/static/Home.html',
    controller : 'DataController'
  })
  
  .otherwise({redirectTo: '/'})
});

app.controller('DataController', function($scope, Service , $timeout) {
      

      $scope.CityAvgTempData=[[ 8,12], [ 4,5.5],[ 11,14],[ 4,5],[ 3,3.5],[ 6.5,7]] 
      $scope.PredictedTemp = "" 
      $scope.City = "Delhi"
      $scope.Country = "India"
      $scope.Month = 1
      $scope.Year = ""
      $scope.NumberOfYears = 50

      

      $scope.$watch( Service.CityAvgTempData, function (CityAvgTempData ) 
      {
          $scope.CityAvgTempData = JSON.stringify(Service.CityAvgTempData());
          a =  JSON.parse($scope.CityAvgTempData);

          var data = new google.visualization.DataTable();
            data.addColumn('number', 'Year');
            data.addColumn('number', 'temp');
            data.addRows(JSON.parse($scope.CityAvgTempData));

          var options = {
            title: 'Year vs. Avg Temperature',
            hAxis: {title: 'Year'},
            vAxis: {title: 'Avg Temperature'},
            legend: 'none',
            trendlines: { 0: {} }
          };


            // Instantiate and draw our chart, passing in some options.
            $scope.chart = new google.visualization.ScatterChart(document.getElementById('Regression'));
            $scope.chart.draw(data, options);

            $scope.Coefficient = Service.Coefficient()
            $scope.Intercept = Service.Intercept()

      }),
      
      $scope.$watch( Service.PredictedTemp, function (PredictedTemp ) 
      {
        $scope.PredictedTemp = Service.PredictedTemp();
      });
      

    $scope.getPredictedTemp = function()
    {      
      Service.getPredictedTemp($scope.City, $scope.Country, $scope.Month, $scope.Year);
    } 

    $scope.getCityAvgTempData = function()
    {
      
      Service.getCityAvgTempData($scope.City, $scope.Country, $scope.Month, $scope.NumberOfYears);
    }

  });
  




  app.factory( 'Service', function($http) { 

  var CityAvgTempData=[[ 8,12], [ 4,5.5],[ 11,14],[ 4,5],[ 3,3.5],[ 6.5,7]]
  var PredictedTemp = ""
  var Coefficient = ""
  var Intercept = ""
  

  return {

      getCityAvgTempData: function(City, Country, Month, NumberOfYears)
        {
          $http({
              method  : 'POST',
              url     : 'http://127.0.0.1:5000/AvgMonthTemp',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              },
              data: {"City": City, "Country" : Country, "Month":Month, "NumberOfYears":NumberOfYears}
          }).success(function(data) {
                  console.log(data)
                  CityAvgTempData = data.data;
                  Coefficient = data.cofficient;
                  Intercept = data.intercept;
                })
              .error(function(data) {
                    alert("Server has some problem. Please try after sometime.");
                });
        },

        CityAvgTempData:function()
        {
          return CityAvgTempData;
        }, 

        Coefficient:function()
        {
          return Coefficient;
        },

        Intercept:function()
        {
          return Intercept;
        }, 


        getPredictedTemp: function(City, Country, Month, Year)
        {
          $http({
              method  : 'POST',
              url     : 'http://127.0.0.1:5000/AvgTempForSpecifiedMonthWithRegression',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              },
              data: {"City": City, "Country" : Country, "Month":Month, "Year":Year}
          }).success(function(data) {
                  
                  PredictedTemp = data.avgTemp                  
                })
              .error(function(data) {
                    alert("Server has some problem. Please try after sometime.");
                });
        },

        PredictedTemp:function()
        {
          return PredictedTemp;
        },    
      };
});





    
})();