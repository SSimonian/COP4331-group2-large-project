var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {

	const userId = document.getElementById("user_id").textContent;
	var docId;
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
					var documents, row, pubKey, nickname_cell, expire_time_cell, cipher_text_cell, docId_cell, upPubKey_cell;
					var docs_table = document.getElementById("recpient_table");
					for (; i < count; i++) {
						documents = data.documents[i];
						pubKey = data.pubKeys[i];

						console.log("Documents: " + documents);
						console.log("Document:\n " + documents._id + "\n " + documents.nickname + "\n " + documents.ciphertext
							+ "\n " + documents.expire_time + "\n " + documents.user_id + "\n " + documents.recipient_id);

						row = docs_table.insertRow(i);
						nickname_cell = row.insertCell(0);
						expire_time_cell = row.insertCell(1);
						cipher_text_cell = row.insertCell(2);
						docId_cell = row.insertCell(3);
						upPubKey_cell = row.insertCell(4);
						dnd_button_cell = row.insertCell(5);

						nickname_cell.className = 'column1';
						expire_time_cell.className = 'column2';
						cipher_text_cell.className = 'column3';
						docId_cell.className = 'column4';
						upPubKey_cell.className = 'column5';
						dnd_button_cell.className = 'column6';

						var date = new Date(documents.expire_time);

						nickname_cell.textContent = documents.nickname;
						expire_time_cell.textContent = date.toLocaleDateString() + " -- " + date.toLocaleTimeString();
						
						docId_cell.textContent = documents._id;
						docId_cell.style.display = 'none';
						
						cipher_text_cell.style.display = 'none';
						upPubKey_cell.style.display = 'none';


						upPubKey_cell.textContent = pubKey;
						// upPubKey_cell.display = 'none';


						if (documents.ciphertext)
						{
							cipher_text_cell.textContent = documents.ciphertext;
							dnd_button_cell.innerHTML = "<td><button class='DnD' style='width: 80%; font-size: 20px;' onclick='decryptdownload(" + i + ")'>Decrypt and Download!</button></td>";
						}
						else
						{
							cipher_text_cell.textContent = "Not available.";
						}
					}
				}
			}
		});
	}

	$('#recpient_table').on('click', 'tr', function(){
			$http.post('/documents/viewdoc', {
				 docId : $(this).find('td:eq(3)').html()
			})
			// $http.post('/documents/viewdoc')
			.then(response => {
				// $('body').html(response.data);
				// if(response.status == 200) {
				//	 var jsonObject = response;
				//	 console.log(jsonObject);
				// }
				// console.log(response.data);
			});
		});
});

