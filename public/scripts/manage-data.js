$( document ).ready(function() {
  makeSearchAjax();
  $('#searchBox').on('keyup', function() {
    makeSearchAjax();
  });

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
        $('#results').append(individualEntry);
    }
  };
});
