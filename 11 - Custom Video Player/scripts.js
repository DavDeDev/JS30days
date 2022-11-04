// GET THE ELEMENTS

const player = document.querySelector(".player");
const video = player.querySelector(".viewer");

const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");

const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");

// BUILD THE FUNCTIONS

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  toggle.textContent = icon;
}

function skip() {
  //each data- attribute of the element is stored in an array that can be accessed by "dataset.nameOfData"
  console.log(this.dataset.skip);
  // to see video or audio properties and methods go to https://www.w3schools.com/tags/av_prop_currenttime.asp
  video.currentTime += parseFloat(this.dataset.skip);
}

//This function handles bars of volume and speed
function handleRangeUpdate() {
  video[this.name] = this.value;
}

//Handles the main bar
function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  // flex basis specifies the initial length of a flexible item
  progressBar.style.flexBasis = `${percent}%    `;
}

//Handles when I click on the progress bar
function scrub(e){
    //offsetWidth shows the x max length of the progress and video.duration stores the whole length of the video
    const scrubTime = (e.offsetX / progress.offsetWidth)*video.duration;
    video.currentTime=scrubTime;
    console.log(e.offsetX);
}

// EVENT LISTENERS

video.addEventListener("click", togglePlay);
toggle.addEventListener("click", togglePlay);
//To change the symbol ( play or pause) instead of listening for the click, is better to check if the video is running or not
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
//To skip few seconds
skipButtons.forEach((button) => button.addEventListener("click", skip));
//To handle the two bars
ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate));
ranges.forEach((range) =>
  range.addEventListener("mousemove", handleRangeUpdate)
);
// To change the main progression bar
video.addEventListener("timeupdate", handleProgress);


// Triggers when clicking on progress bar
progress.addEventListener("click",scrub);
//!! Handles the actual scrolling on the progress bar...
//progress.addEventListener("mousemove",scrub) //... but this trigger the whole time we have the mouse on the bar


//This flag is used for the scrolling part of the progress bar
let mousedown = false;
progress.addEventListener("mousedown",()=> mousedown = true);
progress.addEventListener("mouseup",()=> mousedown = false);
//! Only when the mousedown is true it will move on executing the function
progress.addEventListener("mousemove",(e)=>mousedown && scrub(e)); // TODO: We have to pass the event to the function tho!

