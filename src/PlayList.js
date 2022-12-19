import logo from "./logo.svg";
import "./App.css";
import anime from "animejs";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
//import backend from "./backend.js";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import $ from 'jquery';

function PlayList(props) {
  console.log(props.value)
  return (
    props.value.map((curr) => {
      // <div id = {curr}>
      //   {curr.liked} Name: {curr.songName} <button onClick={removeSong(curr)}>Remove</button> <button onClick={playSong(curr)}>Play</button> <button onClick={changeLike(curr)}>Like</button> <button onClick={openSongInSpotify(curr)}>Open Song</button> <button onClick={openArtistInSpotify(curr)}>Open Artist</button><br></br> Artists: {curr.artists} <br></br>
      // </div>
      }))
  //);
}

export default PlayList;