var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http)
{

	const userId = document.getElementById("user_id").textContent;

	// Hides or Shows a Div.
	function hideOrShow( elementId, showState )
	{
		var vis = "visible";
		var dis = "block";
		if( !showState )
		{
			vis = "hidden";
			dis = "none";
		}

		document.getElementById( elementId ).style.visibility = vis;
		document.getElementById( elementId ).style.display = dis;
	}

	$scope.findRecipient = function()
	{
		console.log("Made it to findRecipient");
		const recipient_name = document.getElementById("recipient").value;
		console.log("Recipient's name: " + recipient_name);

		$http.post('/users/findrecipient',
		{
			"user_name": recipient_name
		})
			.then(function(response)
			{
				if (response.status === 200)
				{
					document.getElementById("messages").textContent = "";
					console.log("Status was 200!");
					console.log(response.data);
					var jsonObject = response.data;
					document.getElementById("recipient_id").textContent = jsonObject._id;
					document.getElementById("recipient_public_key").textContent = jsonObject.public_key;
					hideOrShow("upload_doc", true);
				} else
				{
					document.getElementById("messages").textContent = "Recipient not found."
				}
			});
	};

	$scope.uploadDoc = function()
	{
		const nickname = document.getElementById("nickname").value;
		const ciphertext = document.getElementById("encrypted_message").value;
		const recipient_id = document.getElementById("recipient_id").textContent;

		$http.post('/documents/submitdoc',
		{
			"nickname": nickname,
			"ciphertext": ciphertext,
			"user_id": userId,
			"recipient_id": recipient_id
		})
		.then(function(response)
		{
			if (response.status === 201)
			{
				console.log("Status was 201!");
				console.log(response.data);
				document.getElementById("messages").textContent = "Document successfully uploaded.";
			} else
			{
				document.getElementById("messages").textContent = "Please verify that you provided the correct credentials."
			}
		});
	}
});