var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {

  const userId = document.getElementById("user_id").innerHTML;

  // Hides or Shows a Div.
  function hideOrShow( elementId, showState ) {
    var vis = "visible";
    var dis = "block";
    if( !showState ) {
      vis = "hidden";
      dis = "none";
    }

    document.getElementById( elementId ).style.visibility = vis;
    document.getElementById( elementId ).style.display = dis;
  }

  $scope.findRecipient = function() {
    console.log("Made it to findRecipient");
    const recipient_name = document.getElementById("recipient").value;
    console.log("Recipient's name: " + recipient_name);

    $http.post('/users/findrecipient', {
      "user_name": recipient_name
    })
      .then(function(response) {
        if (response.status === 200) {
          document.getElementById("messages").innerHTML = "";
          console.log("Status was 200!");
          console.log(response.data);
          var jsonObject = response.data;
          document.getElementById("recipient_id").innerHTML = jsonObject._id;
          document.getElementById("recipient_public_key").innerHTML = jsonObject.public_key;
          hideOrShow("upload_doc", true);
        } else {
          document.getElementById("messages").innerHTML = "Recipient not found."
        }

      });
  };

  $scope.uploadDoc = function() {
    const nickname = document.getElementById("nickname").value;
    const ciphertext = document.getElementById("plaintext").value; // TODO create actual cipher text.
    const recipient_id = document.getElementById("recipient_id").innerHTML;

    $http.post('/documents/submitdoc', {
      "nickname": nickname,
      "ciphertext": ciphertext,
      "user_id": userId,
      "recipient_id": recipient_id
    })
    .then(function(response) {
      if (response.status === 201) {
        console.log("Status was 201!");
        console.log(response.data);
        document.getElementById("messages").innerHTML = "Document successfully uploaded.";
      } else {
        document.getElementById("messages").innerHTML = "Please verify that you provided the correct credentials."
      }

    });
  }
});