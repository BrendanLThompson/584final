const playlistDoc = document.getElementById("playList")

let seed = '?!';
let offset = -1;
let currData;
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

// Set token
let _token = hash.access_token;
const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
const Id = "1690ac681878421d8748db804a2b0c27";
const Uri = "http://localhost:3000/";
const scopes = ["streaming"];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${Id}&redirect_uri=${Uri}&scope=${scopes.join(
    "%20"
  )}&response_type=token`;
}

// Set up the Web Playback SDK

let dev;

window.onSpotifyPlayerAPIReady = () => {
  const player = new Spotify.Player({
    name: "Just a Random Song",
    getOAuthToken: (cb) => {
      cb(_token);
    },
  });

  // Playback status updates
  player.on("player_state_changed", (state) => {
    if (
      state.paused &&
      state.position === 0 &&
      state.restrictions.disallow_resuming_reasons &&
      state.restrictions.disallow_resuming_reasons[0] === "not_paused"
    ) {
      randSong();
    }
  });

  // Ready
  player.on("ready", (data) => {
    dev = data.device_id;
  });

  // Connect to the player!
  player.connect();
};

function genQuery(length) {
  var result = "";
  var char = "abcdefghijklmnopqrstuvwxyz";
  var charLength = char.length;
  for (var i = 0; i < length; i++) {
    result += char.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}

function randSong() {
  seed = genQuery(2);
  offset = Math.floor(Math.random() * 500);

  $.ajax({
    url:
      "https://api.spotify.com/v1/search?type=track&offset=" +
      offset +
      "&limit=2&q=" +
      seed,
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + _token);
    },
    success: function (data) {
      currData = data;
      console.log(currData)

      let track = data.tracks.items[0].uri;
      $("#current-track-name-save").attr("data-song", data.tracks.items[0].uri);
      $("#current-track-name-save").attr("src");
      $("#embed-uri").attr(
        "src",
        "https://open.spotify.com/embed/track/" + data.tracks.items[0].id
      );
      $("#current-track-name-save").css("display", "block");
    },
  });
}

var playList = []
function playListMaker() {
  if(offset == -1) {
    console.log("No song selected")
    return;
  }
  playList.push({
    offset: offset,
    seed: seed,
    liked: "",
    songName: currData.tracks.items[0].name,
    songURL: currData.tracks.items[0].external_urls.spotify,
    artistURL: currData.tracks.items[0].artists[0].external_urls.spotify,
    artists: currData.tracks.items[0].artists.map(temp => " " + temp.name),
    id: currData.tracks.items[0].id
  })
  updatePlayList();
}

function removeSong(curr) {
  playList.splice(curr,1)
  updatePlayList();
}
function playSong(curr) {
  $.ajax({
    url:
      "https://api.spotify.com/v1/search?type=track&offset=" +
      playList[curr].offset +
      "&limit=2&q=" +
      playList[curr].seed,
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + _token);
    },
    success: function (data) {
      currData = data;
      let track = data.tracks.items[0].uri;
      $("#current-track-name-save").attr("data-song", data.tracks.items[0].uri);
      $("#current-track-name-save").attr("src");
      $("#embed-uri").attr(
        "src",
        "https://open.spotify.com/embed/track/" + data.tracks.items[0].id
      );
      $("#current-track-name-save").css("display", "block");
    },
  });
}

function changeLike(curr) {
  playList[curr].liked == "&#x2665" ? playList[curr].liked = "" : playList[curr].liked = "&#x2665";
  updatePlayList();
}

function updatePlayList() {
  playlistDoc.innerHTML = ""
  for(var i in playList) {
    playlistDoc.innerHTML += "<div id = '"+i+"'>" + playList[i].liked + " Name: " + playList[i].songName + " <button onclick=removeSong('"+i+"')>Remove</button> <button onclick=playSong('"+i+"')>Play</button> <button onclick=changeLike('"+i+"')>Like</button> <button onclick=openSongInSpotify('"+i+"')>Open Song</button> <button onclick=openArtistInSpotify('"+i+"')>Open Artist</button><br>" + "Artists:" + playList[i].artists + "<br></div>"
  }
}

function openSongInSpotify(curr) {
  window.open(playList[curr].songURL)
}

function openArtistInSpotify(curr) {
  window.open(playList[curr].artistURL)
}
//key needs to be updated daily?
function addToSpotify() {
  playList.map((curr) => {
    $.ajax({
      url:
        "https://api.spotify.com/v1/me/tracks?ids=" + curr.id,
      type: "PUT",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + "BQCo_2RP4omjt0DJJ8nEKF2-fLXtK8_oFPM482tQnfD1PrvSbbb7nnBVasT125V2etargwRDpb4itHvGA817fsj5qUMpK5YtH6kYV5KQbbdgSQ3Vn7lkbwkATU9bcivpztF61dBpTXD5fiuUvFlB6AYUEhMI37TJhsKbR51v1JJBfBXDMeMhvEOrd5A");
      },
      success: function (data) {
        console.log(data)
      },
    });
  });
}



