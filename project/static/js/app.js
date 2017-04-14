(function(){

google.load('visualization', '1', {packages: ['corechart']});

google.setOnLoadCallback(function() {
    angular.bootstrap(document.body, ['WeatherAnalysis']);
});

var app = angular.module('WeatherAnalysis',[]);


app.controller('DataController', function($scope, Service , $timeout) {
      

      $scope.CityAvgTempData=[[ 8,12], [ 4,5.5],[ 11,14],[ 4,5],[ 3,3.5],[ 6.5,7]]  
      $scope.City = "Delhi"
      $scope.Country = "India"
      $scope.Month = 1

      

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

      });
      

    $scope.getCityAvgTempData = function()
    {
      
      Service.getCityAvgTempData($scope.City, $scope.Country, $scope.Month);
    }

    $scope.returnCityAvgTempData = function()
    {
      return CityAvgTempData
    }
      
  });
  




  app.factory( 'Service', function($http) { 

  var CityAvgTempData=[[ 8,12], [ 4,5.5],[ 11,14],[ 4,5],[ 3,3.5],[ 6.5,7]]

  

  return {

      getCityAvgTempData: function(City, Country, Month)
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
              data: {"City": City, "Country" : Country, "Month":Month}
          }).success(function(data) {
                  CityAvgTempData = data;
                })
              .error(function(data) {
                    alert("Server has some problem. Please try after sometime.");
                });
        },

        CityAvgTempData:function()
        {
          return CityAvgTempData;
        },      
      };
});





    
})();