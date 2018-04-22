    var check = function() {
  if(!document.getElementById("newpass").value && !document.getElementById("repeatpass").value)
  {
      document.getElementById("errors").innerHTML = "";
      return;
  }
  if (document.getElementById("newpass").value ==
    document.getElementById("repeatpass").value) {
    document.getElementById("errors").style.color = 'green';
    document.getElementById("errors").innerHTML = 'Passwords are matching';
  } else {
    document.getElementById("errors").style.color = 'red';
    document.getElementById("errors").innerHTML = 'Passwords are not matching';
  }
}