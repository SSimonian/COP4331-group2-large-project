var app = angular.module('myApp2', []);
app.controller('myCtrl2', function($scope, $http) {

  $('#test').on('click', 'tr', function(){
     console.log("test!!!");
  });

  $scope.init = function(){
    console.log("test!!!");
    // $http.post('/documents/retrieveText', {
    //       docId : document.getElementById("docId").innerText
    // }).
    // then(function(response)
    // {
    //    var JsonObject = response.data;
    //    var pubKey = JsonObject.uploaderPublicKey;
    //    var ciphertext = JsonObject.ciphertext;
    //    console.log(pubkey+" "+ciphertext);
    // });
  }
});