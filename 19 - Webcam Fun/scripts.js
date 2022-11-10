const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  //! To access someone's webcam, we need to use the navigator object
  // This will return a promise
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      //! We need to convert the media stream into a URL that we can use in the video element
      //video.src = window.URL.createObjectURL(localMediaStream); // Deprecated
      video.srcObject = localMediaStream;
      // Without playing the video, the video will display a black screen
      video.play();
    })
    .catch((err) => {
      console.error(`OH NO!!!`, err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    var pixels = ctx.getImageData(0, 0, width, height);
    // console.log(pixels.height);
    // debugger; // Will stop the debugging
   // pixels = redEffect(pixels);

    //pixels = rgbSplit(pixels);
    //ctx.globalAlpha = 0.1;

    pixels = greenScreen(pixels);

    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  //Set the sound effect
  snap.currentTime = 0;
  snap.play();

  // Take the data out of the canvas
  const data = canvas.toDataURL("image/jpeg");
  console.log(data); // This will print a sting representation of the image
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "handsome");
  link.innerHTML = `<img src="${data}" alt="Handsome man" />`; //This will display the image a link to download it
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  // We don't use map because is
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 100] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 150] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {  
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        //We set the alpha to 0 to make it transparent
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }
getVideo();

// Listen for the video to load and it will emit an event called 'canplay'
video.addEventListener("canplay", paintToCanvas);
