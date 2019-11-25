$(function() {
  $.ajax({
    type: "POST",
    url: "/delete",

    success: function() {
      console.log("we are here");

      //show content
      alert("deletion successful");
      location.reload(true);
    }
  });
});
