$(function() {
  console.log("loaded");

  window.addNote = function(id) {
    alert("adding note for: " + id);
    var noteTxt = $("#textarea-field").val();
    if (noteTxt) {
      $.ajax({
        url: "/savenote",
        method: "POST",
        data: {articleId: id, body: noteTxt, title: "Note for Article " + id}
      }).done(function(data){ 
        window.location.href = "/notes/" + id;
      })
    }
  }

  window.deleteNote = function(noteId, articleId) {
    alert("deleting note with: " + noteId);
    $.ajax({
      url: "/deletenote",
      method: "POST",
      data: {noteId: noteId}
    }).done(function(data) { 
      window.location.href = "/notes/" + articleId;
    })
  }

  window.articleNotes  = function(id) {
    window.location.href = "/notes/" + id;
  }

  window.deleteArticle  = function(title, link) {
     $.ajax({
      url: "/delete",
      method: "POST",
      data: {title: title, link: link}
    }).done(function(data){ 
      window.location.href = "/articles";
    })
  }

  window.saveArticle = function(title, link) {
    $.ajax({
      url: "/save",
      method: "POST",
      data: {title: title, link: link}
    }).done(function(data){ 
      console.log(data);
    })
  }

  $("#get-article-button").on("click", function(event) {
    window.location.href = "/scrape";
  });

  $("#saved-article-button").on("click", function(event) {
    window.location.href = "/articles";
  });
  

});





