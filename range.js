let lowerSlider = document.querySelector("#lower"),
  upperSlider = document.querySelector("#upper"),
  lowerOutput = document.querySelector("output.left"),
  upperOutput = document.querySelector("output.right"),
  lowerVal = 0,
  upperVal = 0;
updateRangeValues();

upperSlider.oninput = function () {
  updateRangeValues();
  if (upperVal < lowerVal + 1) {
    lowerSlider.value = upperVal - 1;

    if (lowerVal == lowerSlider.min) {
      upperSlider.value = 1;
    }
  }
  updateRangeValues();
};

lowerSlider.oninput = function () {
  updateRangeValues();
  if (lowerVal > upperVal - 1) {
    upperSlider.value = lowerVal + 1;

    if (upperVal == upperSlider.max) {
      lowerSlider.value = parseInt(upperSlider.max) - 1;
    }
  }
  updateRangeValues();
};

function updateRangeValues(low = lowerSlider.value, up = upperSlider.value) {
  lowerVal = parseInt(low);
  upperVal = parseInt(up);
  lowerOutput.textContent = `${String(lowerVal).padStart(2, "0")}:00`;
  upperOutput.textContent = `${String(upperVal - 1).padStart(2, "0")}:59`;
  lowerOutput.style.left = `calc(${(lowerVal / (parseInt(lowerSlider.max) + 1)) * 100}%)`;
  upperOutput.style.left = `calc(${(upperVal / (parseInt(lowerSlider.max) + 1)) * 100}%)`;
  lowerOutput.style.marginLeft = upperVal - lowerVal < 2 ? `-5px` : "";
  upperOutput.style.marginLeft = upperVal - lowerVal < 2 ? `5px` : "";
  setCircleOpacity();
}

function setCircleOpacity() {
  document.querySelectorAll("circle").forEach((c) => {
    const hours = parseInt(c.__data__.hrmn.split(":")[0]);
    if (hours < lowerVal || hours >= upperVal) {
      c.style.opacity = 0.2;
    } else {
      c.style.opacity = 1;
    }
  });
}
