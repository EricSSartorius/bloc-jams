// Example Album
 var albumPicasso = {
     name: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { name: 'Blue', length: '4:26' },
         { name: 'Green', length: '3:14' },
         { name: 'Red', length: '5:01' },
         { name: 'Pink', length: '3:21'},
         { name: 'Magenta', length: '2:15'}
     ]
 };
 
 // Another Example Album
 var albumMarconi = {
     name: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { name: 'Hello, Operator?', length: '1:01' },
         { name: 'Ring, ring, ring', length: '5:01' },
         { name: 'Fits in your pocket', length: '3:21'},
         { name: 'Can you hear me now?', length: '3:14' },
         { name: 'Wrong phone number', length: '2:15'}
     ]
 };



// My Album
 var albumFruits = {
     name: 'The Fruits',
     artist: 'Mr. Apple',
     label: 'Rotten',
     year: '1984',
     albumArtUrl: 'assets/images/album_covers/02.png',
     songs: [
         { name: 'Orange', length: '5:55' },
         { name: 'Apple', length: '4:44' },
         { name: 'Grape', length: '3:33' },
         { name: 'Banana', length: '2:22'},
         { name: 'Peach', length: '1:11'}
     ]
 };


  var createSongRow = function(songNumber, songName, songLength) {
     
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return template;
 
 };

 var setCurrentAlbum = function(album) {
 
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
     albumTitle.firstChild.nodeValue = album.name;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 

     albumSongList.innerHTML = '';
 
     for (i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
     }
 
 };

   

//Checks to see if a parent exists. If it doesn't, then show an alert that says "No parent found".
//Shows a different alert when it fails to find a parent with the given class name ("No parent found with that class name")   
var findParentByClassName = function(element, targetClass) {
    
    var currentParent = element.parentElement;
    if (currentParent === undefined){
        alert("No parent found");
    }
    else if(currentParent.className !== targetClass){
        alert("No parent found with that class name");
    }
    else{
        while (currentParent.className != targetClass) {
        currentParent = currentParent.parentElement
    }
        return currentParent;
    }
};



var getSongItem = function(element) {
    
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }
    
};



 var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement); 

    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
     } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
     } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     } 
 };
 // Elements we'll be adding listeners to
 var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
 var songRows = document.getElementsByClassName('album-view-song-item');
 // Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 // Store state of playing songs
 var currentlyPlayingSong = null;
 window.onload = function() {




     setCurrentAlbum(albumPicasso);


//What I originally tried before looking at answer
// songListContainer.addEventListener('mouseover', function(event) { 
//         if (event.target.parentElement.className === 'album-view-song-item') {
//             if (event.target.parentElement.querySelector('.song-item-number') !== currentlyPlayingSong) {
//                 event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
//             };       
//         }   
//      });
     songListContainer.addEventListener('mouseover', function(event) {
         //displays table data in console on mouseover
         // Only target individual song rows during event delegation
        if (event.target.parentElement.className === 'album-view-song-item') {
            // Change the content from the number to the play button's HTML
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
            
            var songItem = getSongItem(event.target);
            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
            }
         
        }
       
     });


     for (i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
             // Revert the content back to the number
        // Selects first child element, which is the song-item-number element
              var leavingSongItem = getSongItem(event.target);
             var leavingSongItemNumber = leavingSongItem.getAttribute('data-song-number');
 
             // #2
             if (leavingSongItemNumber !== currentlyPlayingSong) {
                 leavingSongItem.innerHTML = leavingSongItemNumber;
             }
         });
         songRows[i].addEventListener('click', function(event) {
             clickHandler(event.target);
         });
     }

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

    
};






