var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {

  const userId = document.getElementById("user_id").innerHTML;

  $scope.updateUser = function() {
    const user_name = document.getElementById("user_name").value;
    const frequency = document.getElementById("frequency").value;
    const public_key = document.getElementById("public_key").value;
    const newpass = document.getElementById("newpass").value;
    const repeatpass = document.getElementById("repeatpass").value;

    $http.patch('/users/updateprofile', {
      "_id": userId,
      "user_name": user_name,
      "frequency": frequency,
      "public_key": public_key,
      "freq": frequency,
      "password": newpass,
      "password_repeat": repeatpass
    })
    .then(function(response) {
      if (response.status === 200) {
        console.log("Status was 200!");
        console.log(response.data);
      } else {
        // TODO figure out how to return a status code that signals something was not updated. Fix on back end, then address issue, here.
        document.getElementById("errors").innerHTML = "Please verify that you provided the correct credentials."
      }

    });
  }
});