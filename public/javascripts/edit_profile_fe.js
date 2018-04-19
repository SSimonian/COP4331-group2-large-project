var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {

  const userId = document.getElementById("user_id").innerHTML;

  $scope.updateUser = function() {
    const user_name = document.getElementById("user_name").value;
    const newpass = document.getElementById("newpass").value;
    const repeatpass = document.getElementById("repeatpass").value;

    const years = document.getElementById("years").value;
    const months = document.getElementById("months").value;
    const days = document.getElementById("days").value;
    const hours = document.getElementById("hours").value;

    console.log(years + "\n" + months + "\n" + days + "\n" + hours);

    $http.post('/users/updateprofile', {
      "_id": userId,
      "user_name": user_name,
      "freq": [{
        "years": years,
        "months": months,
        "days": days,
        "hours": hours
      }],
      "password": newpass,
      "password_repeat": repeatpass
    })
    .then(function(response) {
      if (response.status === 200) {
        console.log("Status was 200!");
        document.getElementById("errors").innerHTML = "Account successfully updated."
      } else if (response.status === 500) {
        document.getElementById("errors").innerHTML = "Error with server's database. Please try again later."
      } else {
        document.getElementById("errors").innerHTML = "Please verify that you provided the correct credentials."
      }
    });
  }
});