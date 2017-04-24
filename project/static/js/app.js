(function(){

google.load('visualization', '1', {packages: ['corechart']});

google.setOnLoadCallback(function() {        
        angular.bootstrap(document.body, ['WeatherAnalysis']);
    });

var app = angular.module('WeatherAnalysis',['ngRoute']);

app.config(function($routeProvider){
  $routeProvider  
  
  .when('/Regression',{
    templateUrl : '/static/Home.html',
    controller : 'RegressionDataController'
  })

  .when('/Clustering',{
    templateUrl : '/static/Temperature.html',
    controller : 'ClusterDataController'
  })
  
  .otherwise({redirectTo: '/'})
});

app.controller('ClusterDataController', function($scope, ClusterService , $timeout) {

  
  $scope.temp=[];
  $scope.Coord = [];
  $scope.Month=""
  $scope.Year=""

  $scope.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: {lat: 37.090, lng: -95.712},
        mapTypeId: 'terrain'
      });

  console.log($scope.map);

  $scope.$watch( ClusterService.temp, function () 
  {
    $scope.temp = ClusterService.temp();
    $scope.Coord = ClusterService.Coord();

    console.log("this is watch");   

    
    for (var index = 0; index < $scope.Coord.length; index++) {
          var element = $scope.Coord[index];
          var t = $scope.temp[index]

          var color = '#FF0000' //Red
          if(t == 'Cold_Temperature')
          {
            color = '#9966FF' //Blue
          }
          else if(t == 'Medium_Temperature')
          {
            color = '#99FF00' //Yellow
          }

          var cityCircle = new google.maps.Circle({
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,
            map: $scope.map,
            center: {lat: element[0], lng: element[1]},
            radius: 100000
          });

        }       

  });

  $scope.getCoordinateClusterData = function(){
    ClusterService.getCoordinateClusterData($scope.Year, $scope.Month)
  }
});


app.factory( 'ClusterService', function($http) { 

  var map
  var temp = []
  var Coord = []
  

  return {

      getCoordinateClusterData: function(Year,Month)
        {
          $http({
              method  : 'POST',
              url     : 'http://127.0.0.1:5000/TemperatureClassificationForCoordinates',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              },
              data: {"Month": Month, "Year" : Year}
          }).success(function(data) {
                  console.log(data)
                  temp = data.Temp_Class;		
                  Coord = data.coordinates;
                })
              .error(function(data) {
                    alert("Server has some problem. Please try after sometime.");
                });
        },

         

        temp:function()
        {
          return temp;
        },

        Coord:function()
        {
          return Coord;
        },
                
      };
});












































app.controller('RegressionDataController', function($scope, RegressionService , $timeout) {
      

      $scope.CityAvgTempData=[[1,2],[2,3],[3,4],[5,6],[7,8]] 
      $scope.PredictedTemp = "" 
      $scope.City = "Delhi"
      $scope.Country = "India"
      $scope.Month = 1
      $scope.Year = ""
      $scope.NumberOfYears = 50

      $scope.chart = new google.visualization.ScatterChart(document.getElementById('Regression'));     
      

      $scope.$watch( RegressionService.CityAvgTempData, function () 
      {
          $scope.CityAvgTempData = JSON.stringify(RegressionService.CityAvgTempData());        

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
          
          $scope.chart.draw(data, options);

          $scope.Coefficient = RegressionService.Coefficient()
          $scope.Intercept = RegressionService.Intercept()

      }),
      
      $scope.$watch( RegressionService.PredictedTemp, function () 
      {
        $scope.PredictedTemp = RegressionService.PredictedTemp();
      });
      

    $scope.getPredictedTemp = function()
    {      
      RegressionService.getPredictedTemp($scope.City, $scope.Country, $scope.Month, $scope.Year);
    } 

    $scope.getCityAvgTempData = function()
    {
      
      RegressionService.getCityAvgTempData($scope.City, $scope.Country, $scope.Month, $scope.NumberOfYears);
    }

  });
  




  app.factory( 'RegressionService', function($http) { 

  var CityAvgTempData=[[1,2],[2,3],[3,4],[5,6],[7,8]]
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