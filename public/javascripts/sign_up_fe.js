    var check = function() {
  if(!document.getElementById("newpass").value && !document.getElementById("repeatpass").value)
  {
      document.getElementById("message").innerHTML = "";
      return;
  }
  if (document.getElementById("newpass").value ==
    document.getElementById("repeatpass").value) {
    document.getElementById("message").style.color = 'green';
    document.getElementById("message").innerHTML = 'Passwords are matching';
  } else {
    document.getElementById("message").style.color = 'red';
    document.getElementById("message").innerHTML = 'Passwords are not matching';
    console.log(document.getElementById("message").value);
  }
  console.log(document.getElementById("message").value);
}