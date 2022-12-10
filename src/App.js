import logo from "./logo.svg";
import "./App.css";
import anime from "animejs";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

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
function App() {}

export default App;
