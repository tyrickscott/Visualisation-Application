function setup() {
    createCanvas(400, 400);
    noLoop(); // Run draw() once
  }
  
  function draw() {
    background(255);
  
    var data = [25, 40, 15]; // Replace with your actual data
    var colors = ['blue', 'green', 'purple'];
  
    var diameter = width * 0.8;
    var x = width / 2;
    var y = height / 2;
  
    var lastAngle = 0;
  
    for (var i = 0; i < data.length; i++) {
      fill(colors[i]);
      stroke(0);
      strokeWeight(1);
  
      var angle = radians(map(data[i], 0, sum(data), 0, 360));
      arc(x, y, diameter, diameter, lastAngle, lastAngle + angle);
  
      lastAngle += angle;
    }
  }
  
  function sum(data) {
    var total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i];
    }
    return total;
  }