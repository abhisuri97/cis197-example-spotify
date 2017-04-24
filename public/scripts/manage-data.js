$( document ).ready(function() {
  // run on initial page load
  makeSearchAjax();


  // make an ajax request when someone types in the 
  // search box
  $('#searchBox').on('keyup', function() {
    makeSearchAjax();
  });


  // posts to /search with the user id param (id) and the
  // search term. calls addResultsToPage(...) with the resulting
  // array of result objects

  function makeSearchAjax() {
    $.ajax({
      type: 'POST',
      url: '/search',
      data: { 
        id: $('#data').text(),
        term: $('#searchBox').val() 
      },
      success: function(data) {
        $('#results').empty();
        console.log(data);
        addResultsToPage(data);          
      }
    });
  }



  // Audio playing things, currentAudio set to global variable since
  // audio playing needs to be something that is dependent on a set of
  // results rather than a single song

  var currentAudio = null;

  $('body').on('click', 'h2', function() {
    var src = $(this).data('audio');

    if (currentAudio && src === currentAudio.src) {
      currentAudio.paused ? currentAudio.play() : currentAudio.pause();
    } else {
      if (currentAudio) currentAudio.pause();
      currentAudio = new Audio(src);
      currentAudio.play();
    }
  });


  // toggling favoriting a song
  // if post to /favorite and the song isn't favorited, it will favorite it
  // else it will unfavorite it

  $('body').on('click', '#favorite', function() {
    var self = $(this);
    var id = $(this).data('id');
    $.ajax({
      type: 'POST',
      url: '/favorite',
      data: { id: $('#data').text(), link: id },
      success: function(data) {
        var newText = self.text() === 'favorite this' ? 'unfavorite this' : 'favorite this'
        self.text(newText);
      }
    });
  });

  // general function to add result objects from search to page

  function addResultsToPage(data) {
    for(var i = 0; i < data.length; i++) {
      var entry = 
        [ '<div id="result-box">',
          '<h2 data-audio=' + data[i].preview_url + '>' + data[i].name + '</h2>',
          '<img src=' + data[i].image + '>',
          '<div id="favorite" data-id=' + data[i].id + '>' +
                (data[i].isFavorite === true ? 'un' : '') + 'favorite this</div>',
          '</div>'
        ]
        individualEntry = entry.join('');
        $('#results').append($(individualEntry).hide().fadeIn(500));
    }
  };
});
