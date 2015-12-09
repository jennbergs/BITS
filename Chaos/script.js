//
// This function is the root function for the program. It sets up the
// initial map canvas and calls the functions that calculate the values
// and display them on the graphs. It also contains the global variables
// that are used by other functions within this file.
//
function doStuff() {
  var mapCanv, usIH, xScale, yScale, zoomedX1, zoomedX0, zoomedY1, zoomedY0;
  mapCanv = setUpMap();
  usIH = calcChaos(mapCanv);
  graphBifurcation(usIH);
}

//
// This function sets up the canvas for graphing the parabolic map
// This involves setting up the background, the diagonal unit value
// line and the parabola generated using the user provided vertex
// value.
// Output:
//   mapContext: The mapContext that will be used for rendering
//
function setUpMap() {
  var mapCanvas, mapContext, canH, canW;
  
  mapCanvas = document.getElementById("mapCan");
  mapContext = mapCanvas.getContext("2d");
  
  canH = mapCanvas.height;
  canW = mapCanvas.width;
  
  graphBackground(mapContext, canH, canW);
  graphDiagonal(mapContext, canH, canW);
  graphParabola(mapContext, canH, canW);
  
  return mapContext;
}

//
// This function displays the x and y axes based upon the values
// passed as input parameters
// Inputs:
//   mc0: The mapContext that the background will be drawn on
//   heig0: The height of the canvas
//   widt0: The width of the canvas
//
function graphBackground(mc0, heigh0, widt0) {
  var xOffset, yOffset, xDim, yDim;
  
  xOffset = 10;
  yOffset = 10;
  
  xDim = widt0 - 2 * xOffset;
  yDim = heig0 - 2 * yOffset;
  
  mc0.clearRect(0, 0, widt0, heig0);
  mc0.strokeStyle = "black";
  mc0.strokeRect(xOffset, yOffset, xDim, yDim);
}

//
// This function adds the diagonal unit line (x1 = x0) to
// the specified canvas
// Inputs:
//   mc1: The mapContext to draw to
//   heig1: The height of the canvas
//   widt1: The width of the canvas
//
function graphDiagonal(mc1, heig1, widt1) {
  var xOff, yOff;
  
  xOff = 10;
  yOff = 10;
  
  mc1.beginPath();
  mc1.moveTo(xOff, (heig1 - yOff));
  mc1.lineTo((widt1 - xOff), yOff);
  mc1.strokeStyle = "purple";
  mc1.stroke();
  
  mc1.beginPath();
  mc1.moveTo((widt1 / 2), yOff);
  mc1.lineTo((widt1 / 2), (heig1 - yOff));
  mc1.strokeStyle = "yellow";
  mc1.stroke();
}

//
// This function calculates and displays the parabola on the
// map graph
// Inputs:
//   mc2: The mapContext to draw to
//   hei: The height of the graph area
//   wid: The width of the graph area
//
function graphParabola(mc2, hei, wid) {
  var vert, xArr, yArr, aVal, gpitr, sogx, sogy, x0, y0, xGArr, yGArr, xVal;
  
  x0 = 10;
  y0 = 10;
  
  sogx = wid - 2*x0;
  sogy = hei - 2*y0;
  
  vert = document.getElementById("vertex").value;
  
  if (vert < 0.0) {
    document.getElementById("errMsg").innerHTML = "Invalid vertex " + vert + " < 0.0";
  }
  else if (vert > 1.0) {
    document.getElementById("errMsg").innerHTML = "Invalid vertex " + vert + " > 1.0";
  }
  else {
    // Valid vertex value. Calculate parabola values
    document.getElementById("errMsg").innerHTML = "Valid vertex " + vert;
    
    xArr = [0.0];
    yArr = [0.0];
    
    aVal = -4.0 * vert;
    
    // These are the raw values
    for (gpitr = 1; gpitr < sogx; gpitr++) {
      xVal = gpitr/sogx;
      xArr.push(xVal);
      yArr.push(aVal*xVal*(xVal-1.0));
    }
    
    xGArr = [x0];
    yGArr = [hei-y0];
    
    // These are the transformed for graphing values
    for (gpitr = 1; gpitr < sogx; gpitr++) {
      xGArr.push(Math.floor(xArr[gpitr]*sogx)+x0);
      yGArr.push(Math.floor(hei - yArr[gpitr]*sogy - y0));
    }
    
    // Now graph them
    mc2.beginPath();
    mc2.moveTo(x0, sogy+y0);
    mc2.strokeStyle = "blue";
    for (gpitr = 1; gpitr < sogx; gpitr++) {
      mc2.lineTo(xGArr[gpitr], yGArr[gpitr]);
    }
    mc2.stroke();
  }
}

//
// This function calculates the array of values generated
// by using the specified input vertex, initial value, and
// number of iterations to calcluate
// Input:
//   theCan: The canvas to draw the values to
// Output:
//   either hei (the vertex) if successful, or 0 if unsuccessful
//
function calcChaos(theCan) {
  var hei, ini, aVal, totals, itr, next, chaosArr;
  
  hei = document.getElementById("vertex").value;
  ini = document.getElementById("initial").value;
  totals = document.getElementById("tot2Calc").value;
  
  if (checkValid(hei, ini) == 1) {
    aVal = -4.0 * hei;
    chaosArr = [ini];
    next = 0.0;
    
    for (itr = 1; itr < totals; itr++) {
      next = aVal * ini * (ini - 1.0);
      chaosArr.push(next);
      ini = next;
      next = 0.0;
    }
    
    graphChaosMap(theCan, chaosArr);
    return hei;
  }
  else {
    // The input vaues are invalid. Add and error message.
    document.getElementById("errMsg").initialHTML = "Vertex or x0 value invalid";
  }
  return 0;
}

//
// This function determines if the user input values for vertex and
// initial value are in the valid range (0.0 - 1.0 inclusive for each)
// or not
// Inputs:
//   heig: The user specified height (vertex)
//   init: The user specified initial value (x0)
// Output:
//   1 if the values are both valid
//   0 if either value is invalid
//
function checkValid(heig, init) {
  var valid = 1;
  if (heig > 1.0) {
    valid = 0;
  }
  else if (heig < 0.0) {
    valid = 0;
  }
  if (init > 1.0) {
    valid = 0;
  }
  else if (init < 0.0) {
    valid = 0;
  }
  return valid;
}

//
// This function is responsible for actually drawing the generated
// chaos values up onto the parabola map. As part of the process,
// a coordinate transformation is executed to take the raw data
// values and convert them to an upper-left-based (0,0) format. We
// want the graph to show the standard lower-left-based (0,0) format
// instead. Also, the values are connected by lines to illustrate the 
// progression from x0->x1->x2... so that the way the values change is
// more clear than it would be with simple points. In other words, a
// line is drawn from (x0,0)->(x0,x1)->(x1,x1)->(x1,x2)->(x2,x2)->(x2,x3)...
// Inputs:
//   mc3: The mapContext to draw to
//   chA: The array of calculated values that need to be displayed
//
function graphChaosMap(mc3, chA) {
  var oldx, oldy, newx, newy, inlen, indx;
  
  oldx = chA[0] * 400 + 10;
  oldy = 410;
  
  inlen = chA.length;
  
  mc3.beginPath();
  mc3.moveTo(oldx, oldy);
  mc3.strokeStyle = "red";
  
  for (indx = 1; indx < inlen; indx++) {
    newx = oldx;
    newy = 410 - (chA[indx] * 400);
    mc3.lineTo(newx, newy);
    
    newx = (chA[indx] * 400) + 10;
    mc3.lineTo(newx, newy);
    
    oldx = newx;
    oldy = newy;
  }
  mc3.stroke();
}

//
// This function graphs the bifurcation map. This graph also shows where
// in the map the user chosen height sits. The user vertex is displayed
// first, then the values for each vertex point from 0.00->1.00 are
// calculated, the values are transformed from raw numbers to pixel positions,
// and finally the values for each vertex point are drawn to the map. When
// the values are calculated, the initial 100 values are discarded to allow
// the system to settle into a steady state. This reduces the amount of
// noise that ends up displayed on the image and allows the chaotic and fractal
// nature of the bifurcation map to show mre clearly in the display. This function
// also sets up listeners for up and down mouseclick events to allow the user to
// select a box to zoom in on in another canvas.
// Inputs:
//   uiHeight: The user input height (vertex) as a raw number (0.0-1.0 inclusive)
//
function graphBifurcation(uiHeight) {
  var biCanvas, biContext, biArray, biArrayOfArray, biItr, initH, initX, gHei;
  
  biCanvas = document.getElementById("biCan");
  biContext = biCanvas.getContext("2d");
  
  graphBackground(biContext, biCanvas.height, biCanvas.width);
  
  biContext.fillText("0.0", 0, 412);
  biContext.fillText("vertex", 195, 417);
  biContext.fillText("1.0", 410, 417);
  biContext.fillText("1.0", 0, 10);
  biContext.fillText("0.0", 10, 417);
  biContext.fillText("x", 0, 195);
  
  initX = 0.5;
  
  // Show where the user input height is
  // Convert the user input height to a value along the horizontal axis
  gHei = uiHeight * 400 + 10;
  biContext.strokeStyle = "red";
  biContext.beginPath();
  biContext.moveTo(gHei, 10);
  biContext.lineTo(gHei, 410);
  biContext.stroke();
  biContext.strokeStyle = "black";
  biContext.beginPath();
  
  for (biItr = 0; biItr < 400; biItr++) {
    initH = biItr / 400.0;
    biArray = calcCV(initX, initH);
    addToGraph(initH, biArray, biContext);
  }
  
  // We want to be able to zoom in on an area of the map. To do this we get
  // the position of the mouse at a down click event and at an up click event
  // when they occur inside this canvas.
  var xDown, yDown;
  biCanvas.addEventListener("mousedown", getDownPos, false);
  biCanvas.addEventListener("mouseup", getUpPos, false);
}

//
// This function calculates the values for each vertex value for the bifurcation map.
// It throws away the first 100 values to get to a steady state and reduce noise in
// the map display. 700 values are retained for each value of the vertex that is input.
// Inputs:
//   x0Val: The initial x value to begin calculations with. This value could be 
//     anything in the range 0.0-1.0 exclusive
//   vVal: The vertex vale that the calculations are being executed for.
// Output:
//   arrayVals: An array containing the 700 retained calculated values for the given
//     vertex value as raw numbers.
//
function calcCV(x0Val, vVal) {
  var tItr, x0init, arrayVals;
  
  x0init = x0Val;
  
  // Calculate and throw away the first 100 values to get to a steady state
  for (tItr = 0; tItr < 101; tItr++ ) {
    x0init = -4 * vVal * x0init * (x0init - 1.0);
  }
  arrayVals = [x0init];
  
  for (tItr = 101; tItr < 800; tItr++) {
    x0init = -4 * vVal * x0init * (x0init - 1.0);
    arrayVals.push(x0init);
  }
  
  return arrayVals;
}

//
// This function adds the calculated values to the bifurcation map
// Inputs:
//   curVVal: The current vertex value as a raw number between 0.0 and 1.0 inclusive
//   calCVal: The calculated chaos values for the specified vertex value
//   biCont: The context to draw the values to
//
function addToGraph(curVVal, calCVal, biCont) {
  var xAxis, aItr, tot2Grap, rawY, yAxis;
  
  xAxis = curVVal * 400 + 10;
  tot2Grap = calCVal.length;
  
  for (aItr = 0; aItr < tot2Grap; aItr++) {
    rawY = calCVal[aItr];
    yAxis = 410 - (rawY*400);
    biCont.fillRect(xAxis, yAxis, 1, 1);
  }
}

//
// This function is an event listener that captures a user's down mouse
// click inside the canvas containing the bifurcation map. This function
// sets the values of xDown and yDown and adjusts fr the border offsets
// within the canvas.
// Inputs:
//   eventD: The downClick event that occurs within the bifurcation map
//
function getDownPos(eventD) {
  var downCan;
  downCan = document.getElementById("biCan");
  if (evetD.x != undefined && eventD.y != undefined) {
    xDown = eventD.x;
    yDown = eventD.y;
  }
  else {
    xDown = eventD.clientX + document.body.scrollLeft +
      document.documentElement.scrollLeft;
    yDown = eventD.clientY + document.body.scrollTop +
      document.documentElement.scrollTop;
  }
  
  xDown -= downCan.offsetLeft;
  yDown -= downCan.offsetTop;
}

//
// This function is an event listener that captures a user's up mouse
// click inside the canvas containing the bifurcation map. This function
// sets the values of xUp and yUp and adjusts for the border offsets
// within the canvas. This function also calls graphZoom, which displays
// the selected area zoomed in on another canvas.
// Inputs:
//   eventU: The upClick event that occurs within the bifurcation map
//
function getUpPos(eventU) {
  var xUp, upCan, yUp, upCon;
  upCan = document.getElementById("biCan");
  upCon = upCan.getContext("2d");
  
  if (eventU.x != undefined && eventU.y != undefined) {
    xUp = eventU.x;
    yUp = eventU.y;
  }
  else {
    xUp = eventU.clientX + document.body.scrollLeft +
      document.documentElement.scrollLeft;
    yUp = eventU.clientY + document.body.scrllTop +
      document.documentElement.scrollTop;
  }
  
  xUp -= upCan.offsetLeft;
  yUp -= upCan.offsetTop;
  
  var z1Can = document.getElementById("biZoomCan");
  graphZoom(xUp, yUp, xDown, yDown, z1Can);
}

//
// This function displays the zoomed in bifurcation map in another canvas.
// This function assists in demonstrating the fractal nature of the bifurcation
// map for the user. In order to display the selected area, this function must
// determine the range of raw values that are to be displayed, calculate the 
// values that fall within that range, constrain the values to only those that
// also fall within the vertical range chose, transform the values from raw
// numbers to pixel positions within the canvas, and then draw the values onto
// the canvas.
// Inputs:
//   rawUpX: The x value captured by the upClick listener event
//   rawUpY: The y value captured by the upClick listener event
//   rawDownX: The x value captured by the downClick listener event
//   rawDownY: The y value captured by the downClick listener event
//   z1Canvas: The zoomed in canvas to display the selected range on
//
function graphZoom(rawUpX, rawUpY, rawDownX, rawDownY, z1Canvas) {
  var z1Context, z1Hei, z1Wid, z1InitH, x0, x1, y0, y1, z1Array, z1HforGraph;
  z1Context = z1Canvas.getContext("2d");
  z1Hei = z1Canvas.height;
  z1Wid = z1Canvas.width;
  graphBackground(z1Context, z1Hei, z1Wid);
  
  // Convert the values to their decimal placements
  rawUpX = rawUpX - 10;
  rawUpY = rawUpY - 10;
  rawDownX = rawDownX - 10;
  rawDownY = rawDownY - 10;
  
  // Figure out which way the user drew the box.
  // 4 options: lower right to upper left, lower left to upper right,
  // upper right to lower left, upper left to lower left. Be sure
  // to handle all of them.
  // We want (x0, y0) to be the lower left corner, (x1, y1) to be
  // the upper right.
  if (rawUpX > rawDownX) {
    // We started at a left corner. Which one?
    x0 = rawDownX / 400;
    x1 = rawUpX / 400;
    
    if (rawUpY > rawDownY) {
      // We started at the upper left
      y0 = (400 - rawDownY) / 400;
      y1 = (400 - rawUpY) / 400;
    }
    else {
      // We started at the lower left
      y0 = (400 - rawUpY) / 400;
      y1 = (400 - rawDownY) / 400;
    }
  }
  else {
    // We started at a right corner.
    x0 = rawUpX / 400;
    x1 = rawDownX / 400;
    
    if (rawUpY > rawDownY) {
      // We started at the upper right.
      y0 = (400 - rawDownY) / 400;
      y1 = (400 - rawUpY) / 400;
    }
    else {
      // We started at the lower right.
      y0 = (400 - rawUpY) / 400;
      y1 = (400 - rawDownY) / 400;
    }
  }
  
  if (x0 < 0.0) x0 = 0;
  else if (x0 > 1.0) x0 = 1.0;
  
  if (x1 < 0.0) x1 = 0;
  else if (x1 > 1.0) x1 = 1.0;
  
  if (y0 < 0.0) y0 = 0;
  else if (y0 > 1.0) y0 = 1.0;
  
  if (y1 < 0.0) y1 = 0;
  else if (y1 > 1.0) y1 = 1.0;
  
  alert(" Graphing range of (" + x0 + ", " + y0 + ") to (" + x1 + ", " + y1 + ")");
  
  // Add the values to the axes
  z1Context.fillText(x0, 0, 412);
  z1Context.fillText("vertex", 195, 417);
  z1Context.fillText(x1, 400, 417);
  z1Context.fillText(y0, 0, 10);
  z1Context.fillText("x", 0, 195);
  z1Context.fillText(y1, 10, 417);
  
  z1InitH = x0;
  
  // Now calculate the values to use
  for (z1Itr = 0; z1Itr < 400; z1Itr++) {
    z1InitH = x0 + ((x1 - x0)*z1Itr)/400;
    z1HForGraph = z1Itr/400;
    z1Array = calcCV(0.5, z1InitH);
    // Now transform and constrain the data to only within the selected y values
    z1Array = z1Transform(z1Array, y0, y1);
    addToGraph(z1HForGraph, z1Array, z1Context);
  }
  
  // We want to allow for zooming to examin the zoomed image more closely
  // to see the fractal nature of the bifurcation graph.
  zoomedX0 = x0;
  zoomedX1 = x1;
  zoomedY0 = y0;
  zoomedY1 = y1;
  zoomSmall(z1Canvas);
}

//
// This function performs the transformation from raw numbers to 
// contstrained values for the input arrays
// Inputs:
//   z1A: The array of raw calculated values
//   y0T: The lower y value for the range being displayed
//   y1T: The upper y value for the range being displayed
// Output:
//   newArray: The array of values that are transformed and ready for
//     display
function z1Transform(z1A, y0T, y1T) {
  // We calculated the values of y that occurred, but now we
  // need to eliminate any that are outside the selected y
  // range. We also need to complete a transformation so that
  // our graph will span the entire canvas
  var tfmItr, newArray, transformVal, origRange;
  newArray = [];
  origRange = y1T-y0T;
  for (tfmItr = 0; tfmItr < z1A.length; tfmItr++) {
    // Check each value to see if it is outside of the range
    // Copy it to the new array only if it is within the range
    if (z1A[tfmItr] < y0T) {
      if (z1A[tfmItr] > y1T) {
        // This value is within the range
        // Add it to the new array
        // First transform it
        transformVal = z1A[tfmItr]-y0T;
        transformVal /= origRange;
        transformVal = 1 - transformVal;
        newArray.push(transformVal);
      }
    }
  }
  return newArray;
}

//
// This function adds an event listener to capture a user click within
// the zoomed in bifurcation map
// Inputs:
//   zoomedCan: The canvas containing the zoomed in bifurcation map
//
function zoomSmall(zoomedCan) {
  xScale = zoomedX1 - zoomedX0;
  yScale = zoomedY1 - zoomedY0;
  
  zoomedCan.addEventListener("mousedown", doSmallZoom, false);
}

//
// This function determines the position of a user click within the zoomed
// bifurcation map, takes a range 10 pixels all around the click point, and
// zooms in on that area in another canvas.
// Inputs:
//   eventSZ: The downClick event that occurred within the zoomed bifurcation map
//
function doSmallZoom(eventSZ) {
  var dCan, dCon, xsz, ysz, xsz0, ysz0 xsz1, ysz1, szCon, szCan;
  var dispX0, dispX1, dispY0, dispY1;
  dCan = document.getElementById("biZoomCan");
  dCon = dCan.getContext("2d");
  
  szCan = document.getElementById("biZoom2Can");
  szCon = szCan.getContext("2d");
  
  // For this zoom we are just going to take a range 10 pixels to the top,
  // bottom, and sides of the click location
  if (eventSZ.x != undefined && eventSZ.y != undefined) {
    xsz = eventSZ.x;
    ysz = eventSZ.y;
  }
  else {
    xsz = eventSZ.clientX + document.body.scrollLeft +
      document.documentElement.scrollLeft;
    ysz = eventSZ.clientY + document.body.scrollTop +
      document.documentElement.scrollTop;
  }
  xsz -= dCan.offsetLeft;
  ysz -= dCan.offsetTop;
  
  // Determine our zoom box
  xsz0 = xsz - 10;
  xsz1 = xsz + 10;
  ysz0 = ysz - 10;
  ysz1 = ysz + 10;
  
  // Now determine what range of values that will actually be for display purposes.
  // This has to be based upon the values contained in the initial zoom.
  // We have to transform from pixels to a decimal value between the range of the
  // already zoomed in box
  dispX0 = xsz0 / 400 * xScale + zoomedX0;
  dispX1 = xsz1 / 400 * xScale + zoomedX0;
  dispY0 = ysz0 / 400 * yScale + zoomedY0;
  dispY1 = ysz1 / 400 * yScale + zoomedY0;
  alert( " Graphing range of (" + dispX0 + ", " + dispY0 + ") to (" + dispX1 + ", " + dispY1 + ")");
  
  graphBackground(szCon, szCan.height, szCan.width);
  szCon.fillText(dispX0, 0, 412);
  szCon.fillText("vertex", 195, 417);
  szCon.fillText(dispX1, 400, 417);
  szCon.fillText(dispY0, 0, 10);
  szCon.fillText(dispY1, 10, 417);
  szCon.fillText("x", 0, 195);
  
  var hszi, hsitr, hs4g, hsArr;
  hszi = dispX0;
  
  for (hsitr = 0; hsitr < 400; hsitr++) {
    hszi = dispX0 + ((dispX1 - dispX0) * hsitr) / 400;
    hs4g = hsitr/400;
    hsArr = calcCV(0.5, hszi);
    hsArr = z1Transform(hsArr, dispY0, dispY1);
    addToGraph(hs4g, hsArr, szCon);
  }
}
