(function(){



var app = angular.module('WeatherAnalysis',['ngRoute']);

app.config(function($routeProvider){
  $routeProvider  
  
  .when('/Analysis',{
    templateUrl : '/static/Home.html',
    controller : 'DataController'
  })
  
  .otherwise({redirectTo: '/'})
});


app.directive('chart', function() {
        return {
          restrict: 'A',
          link: function($scope, $elm, $attr) {
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Topping');
            data.addColumn('number', 'Slices');
            data.addRows([
              ['Mushrooms', 3],
              ['Onions', 1],
              ['Olives', 1],
              ['Zucchini', 1],
              ['Pepperoni', 2]
            ]);

            // Set chart options
            var options = {'title':'How Much Pizza I Ate Last Night',
                           'width':400,
                           'height':300};

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart(document.getElementById('piechart'));
            chart.draw(data, options);
          }
      }
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
            console.log(response.data);
            
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