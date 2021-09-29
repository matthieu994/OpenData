let lowerSlider = document.querySelector("#lower"),
  upperSlider = document.querySelector("#upper"),
  lowerOutput = document.querySelector("output.left"),
  upperOutput = document.querySelector("output.right"),
  lowerVal = 0,
  upperVal = 0,
  width = lowerOutput.clientWidth;
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
  const max = lowerSlider.max;
  lowerVal = parseInt(low);
  upperVal = parseInt(up);
  lowerOutput.textContent = `${String(lowerVal).padStart(2, "0")}:00`;
  upperOutput.textContent = `${String(upperVal - 1).padStart(2, "0")}:59`;
  lowerOutput.style.left = `calc(${(lowerVal / parseInt(max)) * 100}% - ${
    width * (lowerVal / parseInt(max))
  }px)`;
  upperOutput.style.left = `calc(${(upperVal / parseInt(max)) * 100}% - ${
    width * (upperVal / parseInt(max))
  }px)`;
  lowerOutput.style.marginLeft =
    upperVal - lowerVal < 2 ? `-${6500 / lowerSlider.clientWidth}px` : "";
  upperOutput.style.marginLeft =
    upperVal - lowerVal < 2 ? `${6500 / lowerSlider.clientWidth}px` : "";
  setCircleOpacity();
}
