$(document).ready(function() {
  $('#searchBox').on('keyup', function() {
    $.ajax({
        type: 'POST',
        url: '/search',
        data: { 
          id: "<%= user[0].spotifyId %>",
          term: $('#searchBox').val() 
        },
        success: function(data) {
          $('#results').empty();
          console.log(data);
          addResultsToPage(data);          
        }
    });
  });

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

  $('body').on('click', '#favorite', function() {
    var id = $(this).data('id');
    $.ajax({
        type: 'POST',
        url: '/favorite',
        data: { id: "<%= user[0].spotifyId %>", link: id },
        success: function(data) {
          console.log(data);
        }
    });
  });

  function addResultsToPage(data) {
    for(var i = 0; i < data.length; i++) {
      var entry = 
        [ '<div>',
          '<h2 data-audio=' + data[i].preview_url + '>' + data[i].name + '</h2>',
          '<img src=' + data[i].image + '>',
          '<div id="favorite" data-id=' + data[i].id + '>favorite this</div>',
          '</div>'
        ]
      individualEntry = entry.join('');
      $('#results').append(individualEntry);
    }
  };
});
