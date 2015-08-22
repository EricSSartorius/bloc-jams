

var createSongRow = function(songNumber, songName, songLength) {
     
       var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);

    var clickHandler = function() {

        var songNumber = parseInt($(this).attr('data-song-number'));
        

        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);

        }
        if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
        }
        else if (currentlyPlayingSongNumber === songNumber) {
            if(currentSoundFile.isPaused()){
                $(this).html(pauseButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
            }
            else{
                $(this).html(playButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
        }
    };

     var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
        // console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);

    return $row;
};



 var setCurrentAlbum = function(album) {
     currentAlbum = album;
 
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.name);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);

     $albumSongList.empty();
 
     for (i = 0; i < album.songs.length; i++) {
        var sound = new buzz.sound(album.songs[i].audioUrl, {  formats: [ 'mp3' ],   preload: 'metadata'  });
         var mySound = function(i,sound){
            return function(){
                var length = sound.getDuration();
                currentSongDurations.push(length);
                var $newRow = createSongRow(i + 1, album.songs[i].name, length);
                $albumSongList.append($newRow);
            }
        };
        sound.bind("loadedmetadata", mySound(i,sound));
     }    

 };


 var resetSong = function(){
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    if (currentSoundFile.isEnded()){
         if (currentSongIndex >= currentAlbum.songs.length -1) {
            currentSoundFile.stop();
            $('.album-song-button').html(playButtonTemplate);
            $('.left-controls .play-pause').html(playerBarPlayButton);
         }  
         else {
            nextSong();
        }
    }
 };

 var setCurrentTimeInPlayerBar = function(currentTime){
    var curTime = $(".current-time").html(filterTimeCode(currentTime));
   
 };

 var setTotalTimeInPlayerBar = function(totalTime){
        var totTime = $(".total-time").html(filterTimeCode(totalTime));
 };

 var filterTimeCode = function(timeInSeconds){
    
    var time = parseFloat(timeInSeconds);
    var wholeMinutes = Math.floor(time / 60);
    var wholeSeconds = Math.floor(time - wholeMinutes * 60);
    if (wholeSeconds >= 10) {
        var formatTime = wholeMinutes + ":" + wholeSeconds;
    }
    else{
       var formatTime = wholeMinutes + ":0" + wholeSeconds; 
    }
    return formatTime;
 };

 var updateSeekBarWhileSongPlays = function() {
 
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
 
            updateSeekPercentage($seekBar, seekBarFillRatio);
          
            setCurrentTimeInPlayerBar(this.getTime());
            resetSong();
        });
    }
 };

 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
 
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 
 }

 var setupSeekBars = function() {
 
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        i
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
            }
        else{
            setVolume(seekBarFillRatio * 100);
        }
        updateSeekPercentage($(this), seekBarFillRatio);
    });

    $seekBars.find('.thumb').mousedown(function(event) {
 
        var $seekBar = $(this).parent();

        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration()); 
            }
            else{
               setVolume(seekBarFillRatio);
            }
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
 
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
 
    });
 
 };

 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.left-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSongDuration);
};

var $playPauseButton = $('.left-controls .play-pause');

var togglePlayFromPlayerBar = function(){
    if (currentlyPlayingSongNumber === null){
        return nextSong();
    }
    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    if(currentSoundFile.isPaused()) {
        currentlyPlayingCell.html(pauseButtonTemplate);
        $playPauseButton.html(playerBarPauseButton);
        currentSoundFile.play();
    }
    else if(currentSoundFile) {
        currentlyPlayingCell.html(playButtonTemplate);
        $playPauseButton.html(playerBarPlayButton);
        currentSoundFile.pause();
    }
};

var setSong = function(songNumber) {

    if (currentSoundFile) {
        currentSoundFile.stop();
    }

    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSongDuration = currentSongDurations[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    setVolume(currentVolume);
};

 var seek = function(time) {
   
   if (currentSoundFile) {
       currentSoundFile.setTime(time);
   }
 };

var setVolume = function(volume) {
 
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 
 };

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};

 var nextSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

 var previousSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
  
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentSongDurations=[];
var currentSongDuration = null;
var currentVolume = 80;

var volumeFill = $(".volume .fill");
var volumeThumb = $(".volume .thumb");
    volumeFill.width(currentVolume + '%');
    volumeThumb.css({left: currentVolume + '%'});

var fillStart = $(".seek-control .fill");
    fillStart.width(0);
var thumbStart = $(".seek-control .thumb");
    thumbStart.css({left: 0});

 var $previousButton = $('.left-controls .previous');
 var $nextButton = $('.left-controls .next');

 $(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayFromPlayerBar);
    setupSeekBars();

 });


var myAlbums = [albumPicasso, albumMarconi, albumFruits];
var index=0;
document.getElementsByClassName("album-cover-art")[0].addEventListener("click", changeAlbum);

function changeAlbum() {
   index++;
    if(index === myAlbums.length){ 
       index=0;
    }
    setCurrentAlbum(myAlbums[index]);   
}
