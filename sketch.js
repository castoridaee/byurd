const allByurds = [];

let neighborRadiusSlider, alignmentSlider, cohesionSlider, separationSlider, fatnessSlider;
let edgeRadio;
let neighborRadiusVal, alignmentVal, cohesionVal, seperationVal, fatnessVal;
let edgeHandleState;

function setup() {

  let myCanvas = createCanvas(500, 500).parent('byurdPen');

  neighborRadiusSlider = select("#neighborRadiusSlider");
  alignmentSlider = select("#alignmentSlider");
  cohesionSlider = select("#cohesionSlider");
  separationSlider = select("#separationSlider");

  fatnessSlider = select("#fatnessSlider");

  // edgeSetting = select
  wrapSetting = select("#wrap");
  bounceSetting = select("#bounce");
  turnSetting = select("#turn");

  neighborRadiusVal = neighborRadiusSlider.value() * 1;
  alignmentVal = alignmentSlider.value() * 1;
  cohesionVal = cohesionSlider.value() * 1;
  separationVal = separationSlider.value() * 1;
  fatnessVal = fatnessSlider.value() * 1;

  wrapOption = document.getElementById("wrap");
  bounceOption = document.getElementById("bounce");
  turnOption = document.getElementById("turn");

  wrapOption.checked = true
  edgeHandleState = 'wrap'

  // edgeRadio.selected('wrap');

  // initializing
  for (i = 0; i < 100; i += 1) {
    allByurds.push(new Byurd(false));
  }
  for (let byurd of allByurds) {
    byurd.updateNeighbors(allByurds);
    byurd.updateNeighborForce();
  }
}

function updateSettings() {
  neighborRadiusVal = neighborRadiusSlider.value() * 1;
  alignmentVal = alignmentSlider.value() * 1;
  cohesionVal = cohesionSlider.value() * 1;
  separationVal = separationSlider.value() * 1;
  fatnessVal = fatnessSlider.value() * 1;
  wrapOption.checked && (edgeHandleState = "wrap");
  bounceOption.checked && (edgeHandleState = "bounce");
  turnOption.checked && (edgeHandleState = "turn");
}

function draw() {
  background(20)
  for (let byurd of allByurds) {
    byurd.update();
    byurd.show();
    if (byurd.cycle % 30 < 1) { // updates it's flock every 30 frames...this is o(n^2) so best to minimize it
      byurd.updateNeighbors(allByurds);
    }
  }
}