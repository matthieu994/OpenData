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

function updateRangeValues() {
  lowerVal = parseInt(lowerSlider.value);
  upperVal = parseInt(upperSlider.value);
  lowerOutput.textContent = `${String(lowerVal).padStart(2, "0")}:00`;
  upperOutput.textContent = `${String(upperVal - 1).padStart(2, "0")}:59`;

  const newLowerVal = Number(
    ((lowerVal - lowerSlider.min) * 100) / (lowerSlider.max - lowerSlider.min)
  );
  lowerOutput.style.left = `calc(${newLowerVal}% + (${8 - newLowerVal * 0.15}px))`;
}
