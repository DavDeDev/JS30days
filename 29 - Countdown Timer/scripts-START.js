let countdown;
const timerDisplay = document.querySelector(".display__time-left");
const endTime = document.querySelector(".display__end-time");
const buttons = document.querySelectorAll("[data-time]");

function timer(seconds) {
  // !!! The easiest solution could be the following:
  //   setInterval(function () {
  //     seconds--;
  //     console.log(seconds);
  //   }, 1000);
  /// !!! But it doesn't work because the setInterval() function is asynchronous, so it can miss some seconds.

  // to avoid "stacking" multiple timers
  console.log(countdown);
  clearInterval(countdown);

  const now = new Date().getTime();
  const then = now + seconds * 1000;
  //Display the time before the timer starts
  displayTimeLeft(seconds);
  displayEndTime(then);

  //! Now we can use the setInterval to display the values
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // Check when to stop the timer
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // Display the time
    displayTimeLeft(secondsLeft);
  }, 1000);
}

// The timer runs after 1 second because the setInterval() function starts after 1 second
function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  const display = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();

  endTime.textContent = `Be back at ${hour > 12 ? hour - 12 : hour}:${minutes}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach((button) => button.addEventListener("click", startTimer));
document.customForm.addEventListener('submit',function(e){
    e.preventDefault();
    const mins = this.minutes.value;
    console.log(mins);
    timer(mins*60);
    this.reset();
});
