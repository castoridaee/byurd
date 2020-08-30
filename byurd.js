class Byurd {
  constructor(tracked) {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector();
    this.force = createVector();
    this.neighborForce = createVector();
    this.facing = createVector();
    this.acceleration = createVector(random(-1, 1), random(-1, 1));
    this.color = color(random(50, 255), random(50, 255), random(50, 255));
    this.naturalSize = random(0.5, 1);
    this.size = this.naturalSize * fatnessVal;
    this.mass = (this.size ** 2) * 5;
    this.tracked = tracked;
    this.cycle = random(0, 1000);
    this.neighbors = [];
  }

  show() {
    drawByurd(this.position, this.facing, this.color, this.size);
  }

  update() {
    updateSettings();

    this.size = this.naturalSize * fatnessVal;
    this.mass = (this.size ** 2) * 5;
    if (this.cycle % 5 < 1) { // updates it's neighboring forces every 5 frames, this is bad scaling so best to minimize it although you have to keep it pretty frequent to get responsive behavior
      this.updateNeighborForce();
    }
    let curSpeedSq = this.velocity.magSq();
    let decelerationForce = this.velocity.setMag(curSpeedSq * -10);
    // let followForce = createVector(mouseX - this.position.x, mouseY -
    // this.position.y).setMag(0.1);

    this.force.setMag(0);

    this.edgeHandle(edgeHandleState);

    this.force.add(p5.Vector.random2D().mult(0.05));
    this.force.add(decelerationForce);

    if (this.velocity.magSq() < 0.02) { // too slow gotta flap yo wings
      this.force.add(this.facing.setMag(1));
    }

    this.force.add(this.neighborForce);

    this.acceleration.add(this.force.div(this.mass));
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.facing.add(this.velocity.div(20)).setMag(1); // this limits the turning speed so it doesn't get all spazzy

    this.cycle++;
    if (this.tracked) {
      this.drawPerception(this.neighbors);
    }
  }

  updateNeighborForce() {
    let newForce = createVector();
    newForce.add(this.align(this.neighbors, alignmentVal));
    newForce.add(this.separate(this.neighbors, separationVal));
    newForce.add(this.cohede(this.neighbors, cohesionVal));
    this.neighborForce = newForce;
  }

  updateNeighbors(allByurds) {
    this.neighbors = [];
    for (let byurd of allByurds) {
      let distToByurd = dist(this.position.x, this.position.y, byurd.position.x, byurd.position.y);
      if (distToByurd < neighborRadiusVal) {
        this.neighbors.push(byurd);
      }
    }
  }

  align(neighbors, strength) {
    if (neighbors.length <= 1) {
      return createVector(0, 0);
    }
    let alignmentForce = createVector();
    for (let byurd of neighbors) {
      // I am going to base this on velocity vector instead of facing, since
      // facing itself is just a 'representation state'
      alignmentForce.add(byurd.velocity);
    }
    return (alignmentForce.setMag(strength));

  }

  separate(neighbors, strength) {
    if (neighbors.length <= 1) {
      return createVector(0, 0);
    }
    let separationForce = createVector();
    for (let byurd of neighbors) {
      if (byurd != this) {
        separationForce.add(createVector(this.position.x - byurd.position.x, this.position.y - byurd.position.y).setMag(1));
      }
    }
    return separationForce.setMag(strength);
  }

  cohede(neighbors, strength) {
    if (neighbors.length <= 1) {
      return createVector(0, 0);
    }
    let avgPosition = createVector();
    for (let byurd of neighbors) {
      if (byurd != this) {
        avgPosition.x += byurd.position.x;
        avgPosition.y += byurd.position.y;
      }
    }
    avgPosition.x = avgPosition.x / (neighbors.length - 1);
    avgPosition.y = avgPosition.y / (neighbors.length - 1);
    let cohesionForce = createVector(avgPosition.x - this.position.x, avgPosition.y - this.position.y);
    return cohesionForce.setMag(strength);
  }

  drawPerception(byurds) {
    strokeWeight(1);
    stroke(255);
    for (let other of byurds) {
      line(this.position.x, this.position.y, other.position.x, other.position.y);
    }
  }

  edgeHandle(mode) {
    let sizeOffset = this.size * 8;
    switch (mode) {
      case 'wrap': // this causes a mild bug with flocking behavior since the byurd won't know it's actually near another one which transitioned to the other side of the screen
        if (this.position.x < 0 - sizeOffset) { this.position.x = this.position.x + width + sizeOffset; }
        else if (this.position.x > (width + sizeOffset)) { this.position.x = this.position.x - width - sizeOffset; }
        if (this.position.y < 0 - sizeOffset) { this.position.y = this.position.y + height + sizeOffset; }
        else if (this.position.y > (height + sizeOffset)) { this.position.y = this.position.y - height - sizeOffset; }
        break;
      case 'bounce':
        // bounce off walls like a sentiant roomba
        let bounceForce = 6 * this.mass;
        if (this.position.x < 0) { this.force.add(bounceForce, 0); }
        if (this.position.y < 0) { this.force.add(0, bounceForce); }
        if (this.position.x > width - 0) { this.force.add(-bounceForce, 0); }
        if (this.position.y > height - 0) { this.force.add(0, -bounceForce); }
        break;
      case 'turn':
        let boundrySize = 100;
        let turnForce = .2 * this.mass;
        if (this.position.x < boundrySize) { this.force.add(turnForce, 0); }
        if (this.position.y < boundrySize) { this.force.add(0, turnForce); }
        if (this.position.x > width - boundrySize) { this.force.add(-turnForce, 0); }
        if (this.position.y > height - boundrySize) { this.force.add(0, -turnForce); }
        break;
      default:
      // don't do nothin
    }
  }
}

function drawByurd(base, vec, myColor, size) {
  push();
  stroke(255);
  strokeWeight(1);
  fill(myColor);
  translate(base.x, base.y);
  rotate(vec.heading());
  let arrowSize = 7 * size;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}