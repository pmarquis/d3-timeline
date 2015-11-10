
var Timeline = function(data){
  this.data = data;
  this.nbData = data.length;
};

Timeline.prototype.processData = function(){
  var minWidthPercent = 15; // minimum width between to elements

  // Fill "width" values
  for(i=0; i<this.nbData - 1; i++){
    this.data[i].width = this.data[i+1].time - this.data[i].time;
  }
  this.data[this.nbData-1].width = 0;

  // Adjust width to have a minimum width
  var minWidth = minWidthPercent * this.data[this.nbData-1].width / 100;
  var totalMarge = 0;
  for(i=0; i < this.nbData-1; i++){
    if(this.data[i].width < minWidth){
      this.data[i].width = minWidth;  
      this.data[i+1].time = this.data[i].time + minWidth - this.data[i].width
    }
    totalMarge += minWidth - this.data[i].width;
  }

  var avgMarge = parseInt(totalMarge / (this.nbData-1));
  for(i=0; i < this.nbData-1; i++){
    this.data[i].width = this.data[i].width - avgMarge;
    this.data[i+1].time = this.data[i].time + this.data[i].width;
  }

  // Fill timeline "color" values
  var rangeBlueColors = ["#BDCEF1", "#9EB8EB", "#80A1E4", "#628BDE", "#4374D7", "#2B60CB", "#2451AC", "#1E438E" ];
  
  var rangeRedColors = ["#FF8080","#FF6666","#FF4D4D","#FF3333","#FF1A1A","#FF0000","#E60000","#CC0000","#B30000","#990000","#800000","#660000"];

  nbColors = rangeRedColors.length;
  for(i=0; i<this.nbData; i++){
    if( (i < this.nbData-1) && !this.data[i+1].complete ){
      this.data[i].color = "lightgrey";
    }
    else{
      this.data[i].color = rangeRedColors[parseInt((i+1) * nbColors / this.nbData)];
    }
  }
};

Timeline.prototype.render = function(container){
  var width = parseInt(d3.select(container).style('width'), 10);
  var margin = { left: 60, top: 60, right: 60, bottom: 60};
  var rectProps = {height: 30};
  var circleProps = {radius : 20};
  var textProps = { height: 50};

  var container = d3.select(container);
  var g = container.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3.scale.linear()
                  .domain([0, this.data[this.data.length-1].time])
                  .range([0, width - margin.right - margin.left]);

  var xAxis = d3.svg.axis()
                .orient("bottom")
                .scale(xScale);


  g.selectAll("rect")
      .data(this.data)
      .enter().append("rect")
        .attr("x", function(d){ return xScale(d.time); })
        .attr("y", -rectProps.height / 2)
        .attr("width", function(d){ return xScale(d.width); })
        .attr("height", rectProps.height)
        .attr("fill", function(d){ return d.color; });
  
  g.selectAll("circle")
      .data(this.data)
      .enter().append("circle")
        .attr("cx", function(d){ return xScale(d.time); })
        .attr("cy", 0)
        .attr("r", circleProps.radius)
        .attr("fill", function(d){ return d.complete ? "darkblue" : "lightgrey"; });
  
  g.selectAll("text")
      .data(this.data)
      .enter().append("text")
        .attr("x", function(d){ return xScale(d.time) - margin.right; })
        .attr("y", textProps.height)
        .text(function(d){ return d.comment; });
};