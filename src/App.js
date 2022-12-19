import "./App.scss";
import anime from "animejs";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import $ from "jquery";
import Snackbar from "@mui/material/Snackbar";

const background = document.getElementById("background");
const getRandomNumber = (limit) => {
  return Math.floor(Math.random() * limit);
};
const setBackgroundColor = () => {
  const h = getRandomNumber(360);
  const randomColor = `hsl(${h}deg, 50%, 10%)`;
  background.style.backgroundColor = randomColor;
  background.style.color = randomColor;
};
setBackgroundColor();
setInterval(() => {
  setBackgroundColor();
}, 1500);

//Tile grid setup and toggling opacity
const wrapper = document.getElementById("tiles");
let columns = 0,
  rows = 0,
  toggled = false;
const toggle = () => {
  toggled = !toggled;

  document.body.classList.toggle("toggled");
};

//handles anime js animation onclick
const handleOnClick = (index) => {
  toggle();

  anime({
    targets: ".tile",
    opacity: toggled ? 0 : 1,
    translateX: anime.stagger(10, {
      grid: [columns, rows],
      from: index,
      axis: "x",
    }),
    translateY: anime.stagger(10, {
      grid: [columns, rows],
      from: index,
      axis: "y",
    }),
    rotateZ: anime.stagger([0, 90], {
      grid: [columns, rows],
      from: index,
    }),
    delay: anime.stagger(50, {
      grid: [columns, rows],
      from: index,
    }),
  });
};

//checks if tile has been clicked
const createTile = (index) => {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  tile.style.opacity = toggled ? 0 : 1;
  tile.onclick = (e) => handleOnClick(index);
  return tile;
};

//creates array of tiles
const createTiles = (quantity) => {
  Array.from(Array(quantity)).map((tile, index) => {
    wrapper.appendChild(createTile(index));
  });
};

//creates grid of tiles from arrays
const createGrid = () => {
  wrapper.innerHTML = "";
  const size = document.body.clientWidth > 800 ? 100 : 500;
  columns = Math.floor((document.body.clientWidth / size) * 3);
  rows = Math.floor((document.body.clientHeight / size) * 3);
  wrapper.style.setProperty("--columns", columns);
  wrapper.style.setProperty("--rows", rows);

  createTiles(columns * rows);
};

//returns grid
createGrid();
//grid changes on window resize
window.onresize = () => createGrid();
//mui button styling
const ColorButton = styled(Button)(() => ({
  backgroundColor: "rgb(60, 186, 146)",
  "&:hover": {
    backgroundColor: "rgb(114, 175, 211)",
  },
}));

var SpotifyWebApi = require("spotify-web-api-node");

var Spotify = new SpotifyWebApi();

const playlistDoc = document.getElementById("playList");

let seed = "?!";
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
const Uri = "https://584-final.netlify.app/#";
const scopes = ["streaming"];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${Id}&redirect_uri=${Uri}&scope=${scopes.join(
    "%20"
  )}&response_type=token`;
}

// Set up the Web Playback SDK

let dev;

function genQuery(length) {
  var result = "";
  var char = "abcdefghijklmnopqrstuvwxyz";
  var charLength = char.length;
  for (var i = 0; i < length; i++) {
    result += char.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}

var playList = [];

function App() {
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
        console.log(currData);

        let track = data.tracks.items[0].uri;
        $("#current-track-name-save").attr(
          "data-song",
          data.tracks.items[0].uri
        );
        $("#current-track-name-save").attr("src");
        $("#embed-uri").attr(
          "src",
          "https://open.spotify.com/embed/track/" + data.tracks.items[0].id
        );
        $("#current-track-name-save").css("display", "block");
      },
    });
  }

  const [playListHook, changePlayList] = useState([]);

  function playListMaker() {
    if (offset === -1) {
      console.log("No song selected");
      return;
    }
    playList.push({
      offset: offset,
      seed: seed,
      liked: "",
      songName: currData.tracks.items[0].name,
      songURL: currData.tracks.items[0].external_urls.spotify,
      artistURL: currData.tracks.items[0].artists[0].external_urls.spotify,
      artists: currData.tracks.items[0].artists.map((temp) => " " + temp.name),
      id: currData.tracks.items[0].id,
    });
    changePlayList(playList);
    setOpenPlayList(true);
    //updatePlayList();
  }

  function clearPlayList() {
    playList = [];
    changePlayList(playList);
    setOpenClear(true);
  }

  function addToSpotify() {
    playList.map((curr) => {
      $.ajax({
        url: "https://api.spotify.com/v1/me/tracks?ids=" + curr.id,
        type: "PUT",
        beforeSend: function (xhr) {
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " +
              "BQDTijiPMpzMDMYLQh7mSfTlC5krunAiNLtff7SvgADMsC9dDjEFrbx_evZ5l7u-Rc1KlIHuD5OG4ju-4SkaKU6WvSbbxv80AdK6PAQ8INJsgwdP6mMQZXNE6QJnZvLS-BnCES3-jB3QYBHEUN_c_f3tz2g5f6Pul9wwMUuia8bSRW94nwYfAUkfcrnWRdNVM-JguYy2AbhXTvOrD8-iH-8C6wMJ01Hv4UbrG-vO6Koi-6Sl1Cf0eg"
          );
        },
        success: function (data) {
          console.log(data);
        },
      });
    });
    setOpenSpotify(true);
  }

  const [open1, setOpenPlayList] = useState(false);
  const [open2, setOpenSpotify] = useState(false);
  const [open3, setOpenClear] = useState(false);

  const handleClose = () => {
    setOpenPlayList(false);
    setOpenClear(false);
    setOpenSpotify(false);
  };

  return (
    <div id="workspace">
      <div id="space" class="centered-btn">
        <ColorButton
          variant="contained"
          id="btn"
          class="btn"
          onClick={randSong}
        >
          Get a Random Song
        </ColorButton>
      </div>
      <div class="flex">
        <iframe
          id="embed-uri"
          width="500"
          height="580"
          frameBorder="0"
          allow="encrypted-media"
        ></iframe>
      </div>
      <div id="space2" class="centered-btnleft">
        <ColorButton
          variant="contained"
          id="addPlayList"
          class="btn"
          onClick={playListMaker}
        >
          Add Song to Playlist
        </ColorButton>
      </div>
      <div id="space2" class="centered-btnright">
        <ColorButton
          variant="contained"
          id="addToSpotify"
          class="btn"
          onClick={addToSpotify}
        >
          Add Song to Spotify
        </ColorButton>
      </div>
      <div id="space2" class="centered-btnbot">
        <ColorButton
          variant="contained"
          id="clearPlayList"
          class="btn"
          onClick={clearPlayList}
        >
          Clear PlayList
        </ColorButton>
      </div>
      <Snackbar
        open={open1}
        autoHideDuration={1000}
        onClose={handleClose}
        message="Song Added To PlayList"
        //action={action}
      />
      <Snackbar
        open={open3}
        autoHideDuration={1000}
        onClose={handleClose}
        message="PlayList Cleared"
        //action={action}
      />
      <Snackbar
        open={open2}
        autoHideDuration={1000}
        onClose={handleClose}
        message="Songs Added To Spotify"
        //action={action}
      />
    </div>
  );
}

export default App;
