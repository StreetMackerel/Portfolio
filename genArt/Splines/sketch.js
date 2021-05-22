//Splines vars
var vertices = [];
var originalPos = [];
var spline_size = 700; // size of graphic, can be made to be % of screen in setup
var weight = 3;
var numPoints = 0.4; // closer to 0 = more points
var splineWidth = 2; // line thickness
var lowerSpeed = 0.005; // floor and ceiling of speeds
var upperSpeed = 0.017
var alph = 50; // motion blur
var stickiness = 10; // how slow the points get before they change direction
var spiciness = 5 // the closer to 1 the spicier


function setup() {
  noStroke();
  strokeWeight(0.5); //unused
  width = window.innerWidth;
  height = window.innerHeight;
  canvas = createCanvas(width, height);
  canvas.position(0,0,'fixed');
  canvas.style('z-index', '-1');
  resetSpline(spline_size);
  smooth();
  ellipseMode(CENTER);
}

function resetSpline(size) { // creates points array and records initial positions in separate array
  vertices = [];
  originalPos = [];
  for (var i = 0; i <= TWO_PI; i += numPoints) { // in a circle
    vertices.push({ x: (size / 2) * sin(i), y: (size / 2) * cos(i) });
    let vals = [0, 1];
    originalPos.push({
      x: (size / 2) * sin(i),
      y: (size / 2) * cos(i),
      dir: random(vals), //for determining direction
      sp: random(lowerSpeed,upperSpeed) // for determining speed
    });
  }
}

function windowResized() { // handle window size change
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 0, 0, alph);
  drawSplines();
  noFill();
  stroke(150,211,207);
  ellipse(mouseX,mouseY,150,150)
  noStroke();
}

function drawSplines() {
  fill(100,161,157); //orange
  strokeWeight(splineWidth); //unused
  push();
  translate(width / 2, height / 2); // center is 0,0
  beginShape();

  //creates array of midpoints between origin and center for inner targets and same distance inverse direction for outer targets
  for (var i = 0; i < vertices.length; i++) {

    //start by getting midpoint of i and center
    let midpointToCenter = midpoint(originalPos[i].x, originalPos[i].y, 0, 0);
    midpointToCenter = createVector(
      midpointToCenter[0] / spiciness,
      midpointToCenter[1] / spiciness
    );


    if(dist(vertices[i].x, vertices[i].y, originalPos[i].x, originalPos[i].y)>150 || dist(vertices[i].x, vertices[i].y, mouseX-width/2, mouseY-height/2)>150){
      switch(originalPos[i].dir){
        case 0:

          //add vector to point to move in
          let innerPoints = p5.Vector.add(
            createVector(originalPos[i].x, originalPos[i].y),
            createVector(midpointToCenter.x, midpointToCenter.y)
          );

          //lerp in by the object's random speed
          vertices[i].x = lerp(vertices[i].x, innerPoints.x, originalPos[i].sp);
          vertices[i].y = lerp(vertices[i].y, innerPoints.y, originalPos[i].sp);
          //if we reach a certain distance from target, change direction
          if(dist(vertices[i].x, vertices[i].y, innerPoints.x, innerPoints.y)< stickiness){
          originalPos[i].dir = 1;
          }
          break;
        case 1:

          //subtract vector to move out
          let outerPoints = p5.Vector.sub(
            createVector(originalPos[i].x, originalPos[i].y),
            createVector(midpointToCenter.x, midpointToCenter.y)
          );

          vertices[i].x = lerp(vertices[i].x, outerPoints.x, originalPos[i].sp);
          vertices[i].y = lerp(vertices[i].y, outerPoints.y, originalPos[i].sp);
          if(dist(vertices[i].x, vertices[i].y, outerPoints.x, outerPoints.y) < stickiness){
            originalPos[i].dir = 0;
          }
          break;
      } 
    } else {
      fill(150,211,207);
      ellipse(vertices[i].x, vertices[i].y, 10,10);
      vertices[i].x = lerp(vertices[i].x, mouseX-width/2, originalPos[i].sp*1.5);
      vertices[i].y = lerp(vertices[i].y, mouseY-height/2, originalPos[i].sp*1.5);
      fill(100,161,157);
    }

    //places point
    
      curveVertex(vertices[i].x, vertices[i].y);
    
    
  }

  //this handles a known p5 bug with closing curve vertex shapes
  curveVertex(vertices[1].x,vertices[1].y);
  curveVertex(vertices[2].x,vertices[2].y);
  endShape();
  
  //curveTightness(0); pointyness of peaks
  pop();
}

function midpoint(x1, y1, x2, y2) {
  return [(x1 + x2) / 2, (y1 + y2) / 2];
}