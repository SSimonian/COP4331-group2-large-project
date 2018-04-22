var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {

  const userId = document.getElementById("user_id").textContent;

  $scope.getUsersDocs = function() {
    $http.post('/documents/fetchuserdocs', {
      "user_id": userId
    })
    .then(function(response) {
      if (response.status === 200) {
        console.log("Status was 200!");
        var data = response.data;
        console.log("Data: "+ data);
        var count = data.count;

        if (count > 0) {
          var i = 0;
          var documents, row, nickname_cell, expire_time_cell;
          var docs_table = document.getElementById("docs_table");
          for (; i < count; i++) {
            documents = data.documents[i];
            console.log("Documents: " + documents);
            console.log("Document:\n " + documents._id + "\n " + documents.nickname + "\n " + documents.ciphertext
              + "\n " + documents.expire_time + "\n " + documents.user_id + "\n " + documents.recipient_id);

            row = docs_table.insertRow(i);
            nickname_cell = row.insertCell(0);
            expire_time_cell = row.insertCell(1);

            nickname_cell.className = 'column1';
            expire_time_cell.className = 'column2';

            var date = new Date(documents.expire_time);

            nickname_cell.textContent = documents.nickname;
            expire_time_cell.textContent = date.toLocaleDateString() + " -- " + date.toLocaleTimeString();
          }
        }
      }

    });
    $http.post('/documents/fetchrecipientdocs', {
      "recipient_id": userId
    })
      .then(function(response) {
        if (response.status === 200) {
          console.log("Status was 200!");
          var data = response.data;
          console.log("Data: "+ data);
          var count = data.count;

          if (count > 0) {
            var i = 0;
            var documents, row, nickname_cell, expire_time_cell, cipher_text_cell;
            var docs_table = document.getElementById("recpient_table");
            for (; i < count; i++) {
              documents = data.documents[i];
              console.log("Documents: " + documents);
              console.log("Document:\n " + documents._id + "\n " + documents.nickname + "\n " + documents.ciphertext
                + "\n " + documents.expire_time + "\n " + documents.user_id + "\n " + documents.recipient_id);

              row = docs_table.insertRow(i);
              nickname_cell = row.insertCell(0);
              expire_time_cell = row.insertCell(1);
              cipher_text_cell = row.insertCell(2);

              nickname_cell.className = 'column1';
              expire_time_cell.className = 'column2';
              cipher_text_cell.className = 'column3';

              var date = new Date(documents.expire_time);

              nickname_cell.textContent = documents.nickname;
              expire_time_cell.textContent = date.toLocaleDateString() + " -- " + date.toLocaleTimeString();

              if (documents.ciphertext) {
                cipher_text_cell.textContent = documents.ciphertext;
              } else {
                cipher_text_cell.textContent = "Not available.";
              }
            }
          }
        }

      });
  }
  $('#recpient_table').on('click', 'tr', function(){
      $http.post('/documents/view', {
         nickname : $(this).find('td:eq(0)').html(),
         recipient : userId
      })
  .then(response => {
      $('body').html(response.data);
  });
 });
});
