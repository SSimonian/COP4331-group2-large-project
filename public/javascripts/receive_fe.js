var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    $scope.init = function(){
        
        
        
        
        $http.post('/documents/retrieveText', {
            docId : document.getElementById("docId").innerText
      }).
      then(function(response)
      {
         var JsonObject = response.data;
         var pubKey = JsonObject.uploaderPublicKey;
         var ciphertext = JsonObject.ciphertext;
         console.log(pubkey+" "+ciphertext);
      });
    }
});