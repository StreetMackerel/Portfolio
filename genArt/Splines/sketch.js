//Splines vars
var vertices = [];
var originalPos = [];
var spline_size = 700; // size of graphic, can be made to be % of screen in setup
var weight = 3;
var numPoints = .4; // closer to 0 = more points
var splineWidth = 1; // line thickness
var lowerSpeed = 0.005; // floor and ceiling of speeds
var upperSpeed = 0.05
var alph = 50; // motion blur
var stickiness = 10; // how slow the points get before they change direction
var spiciness = 7; // the closer to 1 the spicier
var wanderRange = 90;
var layers = 20;
var md = false;

function setup() {
  noStroke();
  strokeWeight(0.1); //unused
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


  for(var i = 0; i < layers; i++){
  drawExtraSplines(i);
  }
  //noStroke();
  //noFill();
  stroke(255);
  if(md){
   // ellipse(mouseX,mouseY,wanderRange,wanderRange);
  }
}

function mousePressed(){
  md =true;
}
function mouseReleased(){
  md = false;
  mouseX = 0;
  mouseY = 0;
}

function drawSplines() {
  fill(0); //orange
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


    if(dist(vertices[i].x, vertices[i].y, originalPos[i].x, originalPos[i].y)>wanderRange || dist(vertices[i].x, vertices[i].y, mouseX-width/2, mouseY-height/2)>wanderRange){
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
      //fill(150,211,207);
    //  ellipse(vertices[i].x, vertices[i].y, 10,10);
      vertices[i].x = lerp(vertices[i].x, mouseX-width/2, originalPos[i].sp*2.5);
      vertices[i].y = lerp(vertices[i].y, mouseY-height/2, originalPos[i].sp*2.5);
      //fill(100,161,157);
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

function drawExtraSplines(offset){
  push();
  translate(width / 2, height / 2);
  beginShape();

  let newPoints = [];
  vertices.forEach(v => {

    let midpointToCenter = midpoint(v.x,v.y, 0, 0);
    midpointToCenter = createVector(
      midpointToCenter[0] ,
      midpointToCenter[1]
    );

    let newPos = p5.Vector.sub(
      createVector(v.x,v.y),
      createVector((midpointToCenter.x/16)*offset,(midpointToCenter.y/16)*offset)
    );

    if(dist(mouseX-width/2,mouseY-height/2,newPos.x,newPos.y)<150){
      newPos.x += random(-20,20);
      newPos.y += random(-20,20);
    }
    
    newPoints.push(newPos)
  });
  newPoints.forEach(p => {
    curveVertex(p.x,p.y);
  })

  curveVertex(newPoints[1].x,newPoints[1].y);
  curveVertex(newPoints[2].x,newPoints[2].y);

  endShape();
  pop();
}

function midpoint(x1, y1, x2, y2) {
  return [(x1 + x2) / 2, (y1 + y2) / 2];
}