$(function(){
  $('#password').keyup(function() {
    if($('#password').val()=="whydontyouchangetheworld"){
      window.location.href = 'top.html';
    }
  });
});