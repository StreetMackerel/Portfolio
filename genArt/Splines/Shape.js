class Shape {
  constructor(vect, vel, accel){
    this.vect = vect;
    this.velocity = vel;
    this.acceleration = accel;
  }


 Seek(v){
  this.velocity.add(this.acceleration);
 // fill(120,181,177);
  let dVector = p5.Vector.sub(this.vect,v);
  let mag = dVector.mag();
  dVector.normalize();
  dVector.mult(this.velocity);
  this.vect.sub(dVector);
  ellipse(this.vect.x,this.vect.y,15,15);
}
}

