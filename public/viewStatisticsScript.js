// viewStatisticsScript.js
// Constructor function for the ViewStatistics object
function ViewStatistics() {
    
    // Array to store visualisations
    this.visuals = [];
    // Variable to store the currently selected visualisation
    this.selectedVisual = null;
    // Reference to the ViewStatistics object
    var self = this;
      
      
    //Method to add a visualisation to the viewstatistics
    this.addVisual = function (vis) {
      // Check if the visualisation has a 'name' property
      if (!vis.hasOwnProperty('name')) {
        console.error('Visualisation needs a name!');
        return;
      }
  
      // Add the visualisation to the visuals array
      this.visuals.push(vis);
  
      // Create a menu item element for the visualisation
      //create a new HTML list item element using the p5.js library's createElement function and sets the content of the list item to the value of vis.name
      var menuItem = createElement('li', vis.name);
        
      //Style the html list item (add a CSS class to the menuItem element to apply specific styling)
      menuItem.addClass('menu-item');
  
      //using the callback mouseClicked function from p5.js library to set up an event handler for when the mouse is clicked on the menuItem element
      menuItem.mouseClicked(function () {
          //calling the selectVisual method with the argument that is the index of the current visualisation in the visuals array
          self.selectVisual(self.visuals.indexOf(vis));
      });
  
      //uses p5.js select function select an HTML element with the ID 'visuals-menu' to assign it to visMenu
      var visMenu = select('#visuals-menu');
      //using the child function to append the menuItem as a child of the visMenu element, adding the menu item to the list of child elements within the visuals-menu html element
      visMenu.child(menuItem);
    };
  
    // Method to select a visualisation by its index
    this.selectVisual = function (index) {    
  
      if (index != null) {
          
        // Set the selected visualisation to the one at the specified index
        this.selectedVisual = this.visuals[index];
  
        // Call the 'setup' method if it exists in the visualisation
        if (this.selectedVisual.hasOwnProperty('setup')) {
          this.selectedVisual.setup();
        }
      }
    };
  }
  
  // Dummy data for the First Aid Kit storage
  var firstAidData = {
    inUse: 25,
    inStores: 40,
    underMaintenance: 15,
  };
  
  // Constructor function for the FirstAidKit object
  function FirstAidKit() {
    // Properties of the FirstAidKit object
    this.name = 'First Aid Kit Storage';
    this.data = firstAidData;
    //declaring variables I will use
    this.pieStatusDistribution;
    this.selectedPie;
  
    // Method to set up the FirstAidKit object
    this.setup = function () {
      //creating a new instance of pie chart object with its position and diameter size 
      this.pieStatusDistribution = new PieChart(width / 2, height / 2, width * 0.4);
    };
      
    // Method to draw the FirstAidKit object
    this.draw = function () {
      // Labels and colors for the pie chart
      var labels = ['In Use', 'In Stores', 'Under Maintenance'];
      var colours = ['blue', 'green', 'purple'];
  
      // Draw the selected pie chart
        this.pieStatusDistribution.draw(
          [this.data.inUse, this.data.inStores, this.data.underMaintenance],
          labels,
          colours,
          'First Aid Kit Status Distribution'
        );
      
    };
  }
  
  // Constructor function for the PieChart object
  function PieChart(x, y, diameter) {
    // Properties of the PieChart object
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    //variable for the space of labels in the pie chart
    this.labelSpace = 30;
  
    // Method to calculate radians based on data values
    this.get_radians = function (data) {
      //total sum of the values in the data array
      var total = sum(data);
      //initialising an empty array of radians to store the calculated radians for each value in the data array
      var radians = [];
  
      //calculate the radians for the current element in the data array and put the result in radians array
      for (let i = 0; i < data.length; i++) {
        //calculate the ratio of the current data element to the total sum of all data elements then scale the calculated proportion to cover the full circle because two pi represents the angle equivalent to a full circle in radians
        radians.push((data[i] / total) * TWO_PI);
      }
      return radians;
    };
  
    // Method to draw the pie chart
    this.draw = function (data, labels, colours, title) {
        
      //using radians to represent the angles for each data element in the pie chart
      var angles = this.get_radians(data);
      //initialising variable lastAngle that will be used to keep track of the ending angle of the previous pie slice as the loop iterates through the data
      var lastAngle = 0;
      //variable will be used to store the color information for each pie slice in the subsequent loop
      var colour;
  
      // Draw each slice of the pie chart
      for (var i = 0; i < data.length; i++) {
        // Set the color for the slice
        colour = colours[i];
  
        //p5.js fill() function to set the fill color for subsequent slice 
        fill(colour);
        //setting stroke color as black for the outline of the slice
        stroke(0);
        //thickness of the current slice
        strokeWeight(1);
  
        // Draw the slice
        arc(
          this.x,
          this.y,
          this.diameter,
          this.diameter,
          //The starting angle of the arc where the previous slice ended
          lastAngle,
          //calculating the ending angle of the slice with 0.001 addition to avoid overlapping 
          lastAngle + angles[i] + 0.001
        );
  
        // Display legend items 
        this.makeLegendItem(labels[i], i, colour);
        
        //increments the lastAngle variable by the angle of the current slice so that it reflects the ending angle of the current slice
        lastAngle += angles[i];
      }
  
      // Display the title 
      noStroke();
      textAlign('center');
      textSize(24);
      //draw text above the center of the pie chart scaled by 0.6 times the diameter (subtract 60% of the diameter from the y-coordinate to move above the center of the pie chart)
      text(title, this.x, this.y - this.diameter * 0.6);
    };
  
    // Method to create a legend item
    this.makeLegendItem = function (label, i, colour) {
      //calculating the x-coordinate for the legend item starting with the center of the pie chart 
      var x = this.x + 50 + this.diameter / 2;
      var y = this.y + this.labelSpace * i - this.diameter / 3;
      //sets the width of the legend item's color box uses half of this.labelSpace to create a square-shaped color box
      var boxWidth = this.labelSpace / 2;
      var boxHeight = this.labelSpace / 2;
  
      fill(colour);
      rect(x, y, boxWidth, boxHeight);
  
      fill('black');
      noStroke();
      textAlign('left', 'center');
      textSize(12);
      //drawing the text 'label' to be associated with a legend item
      text(label, x + boxWidth + 10, y + boxWidth / 2);
    };
  }
  
  // find the sum of numeric values in an array useful in data analysis and visualisation scenarios for datasets or calculating percentages in charts 
  function sum(data) {
    var total = 0;
    for (let i = 0; i < data.length; i++) {
      total = total + data[i];
    }
    return total;
  }

// Setup function to create a canvas and initialise the viewstatistics
function setup() {
  //p5.js function to initialise a drawing canvas in the browser
  var c = createCanvas(1024, 576);
  //setsn parent of the canvas to HTML element with the ID 'app' allowing the canvas to be displayed within that specific element on the webpage
  c.parent('app');

  //create a new instance of the ViewStatistics object to manage visualisations  
  viewstatistics = new ViewStatistics();
  //create new instance of the FirstAidKit object and add it to the viewstatistics object
  viewstatistics.addVisual(new FirstAidKit());
}

// Draw function to display the selected visual
function draw() {
    background(255);
    if (viewstatistics.selectedVisual != null) {
        viewstatistics.selectedVisual.draw();
    }
}
