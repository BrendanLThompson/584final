import logo from "./logo.svg";
import "./App.css";
import anime from "animejs";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import backend from "./backend.js";
import { styled } from "@mui/material/styles";
import { Button, ButtonProps } from "@mui/material/Button";

const wrapper = document.getElementById("tiles");
let columns = 0,
  rows = 0,
  toggled = false;
const toggle = () => {
  toggled = !toggled;

  document.body.classList.toggle("toggled");
};
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

const createTile = (index) => {
  const tile = document.createElement("div");

  tile.classList.add("tile");

  tile.style.opacity = toggled ? 0 : 1;

  tile.onclick = (e) => handleOnClick(index);

  return tile;
};

const createTiles = (quantity) => {
  Array.from(Array(quantity)).map((tile, index) => {
    wrapper.appendChild(createTile(index));
  });
};

const createGrid = () => {
  wrapper.innerHTML = "";

  const size = document.body.clientWidth > 800 ? 100 : 500;

  columns = Math.floor((document.body.clientWidth / size) * 3);
  rows = Math.floor((document.body.clientHeight / size) * 3);

  wrapper.style.setProperty("--columns", columns);
  wrapper.style.setProperty("--rows", rows);

  createTiles(columns * rows);
};

createGrid();

window.onresize = () => createGrid();

const ColorButton = styled(Button)(() => ({
  backgroundColor: "rgb(60, 186, 146)",
  "&:hover": {
    backgroundColor: "rgb(114, 175, 211)",
  },
}));
function App() {
  return (
    <div>
      <div id="space" class="centered-btn">
        <ColorButton
          variant="contained"
          id="btn"
          class="btn" /*onclick="randSong()"*/
        >
          Get a Random Song
        </ColorButton>
      </div>
      <div class="flex">
        <iframe
          id="embed-uri"
          width="500"
          height="580"
          frameborder="0"
          allow="encrypted-media"
        ></iframe>
      </div>
      <div id="space2" class="centered-btnleft">
        <ColorButton
          variant="contained"
          id="addPlayList"
          class="btn" /*onclick = "playListMaker()"*/
        >
          Add Song To PlayList
        </ColorButton>
      </div>
      <div id="space2" class="centered-btnright">
        <ColorButton
          variant="contained"
          id="addToSpotify"
          class="btn" /*onclick = "addToSpotify()"*/
        >
          Add Songs to Spotify
        </ColorButton>
      </div>
      <div id="playList" value="1"></div>
    </div>
  );
}

export default App;
