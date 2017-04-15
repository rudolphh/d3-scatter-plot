'use strict';

var height = 480,
    width = 800;

var chart = d3.select('.viz').append('svg').attr('id', 'chart').attr('width', width).attr('height', height);

chart.append('text').attr('transform', 'rotate(-90)').attr('x', -280).attr('y', 20).text('Time (in minutes)');

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function (err, data) {
  //console.log(JSON.stringify(data));

  var years = data.map(function (d) {
    return d.Year;
  });
  var times = data.map(function (d) {
    return d.Time;
  });
  var seconds = data.map(function (d) {
    return d.Seconds;
  });

  /*console.log(times.sort(function(a, b){
    return a.substr(0,2)-b.substr(0,2); 
  }));*/

  var yScale = d3.scaleLinear().domain([0, d3.max(times)]).range([0, height - 100]);

  // Axis setup (time)
  var timeParse = d3.timeParse("%M:%S");
  var yAxisScale = d3.scaleTime().domain(d3.extent(times, function (d) {
    return timeParse(d);
  })).range([50, height - 50]);

  var yAxis = d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat("%M:%S"));

  var xAxisScale = d3.scaleLinear().domain([d3.min(years) - 1, d3.max(years) + 1]).range([50, width - 50]);

  var xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format("d"));

  chart.append("g").call(yAxis).attr('id', 'y-axis').attr('transform', 'translate(70, 0)');

  chart.append("g").call(xAxis).attr('id', 'x-axis').attr('transform', 'translate(20,' + (height - 50) + ")");

  var tooltip = d3.select('body').append('div').attr('id', 'tooltip').attr('data-year', '').style('position', 'absolute').style('padding', '0 10px').style('background', 'white').style('opacity', 0);

  // build the chart data
  var color = d3.scaleOrdinal(d3.schemeSet1);

  var handle = chart.selectAll('circle').data(times).enter().append('circle').attr('class', 'dot').attr('data-xvalue', function (d, i) {
    return years[i];
  }).attr('data-yvalue', function (d, i) {
    return timeParse(times[i]);
  }).style('fill', function (d, i) {
    return color(data[i].Doping != "");
  }).attr('stroke', '#ecf0f1').attr('cx', function (d, i) {
    return xAxisScale(1993) + 20;
  }).attr('cy', function (d, i) {
    return yAxisScale(timeParse('39:50'));
  }) //
  .attr('r', 1);

  var legend = chart.selectAll('#legend').data(color.domain()).enter().append('g').attr('id', 'legend').attr('transform', function (d, i) {
    return 'translate(0,' + (height / 5 - i * 20) + ')';
  });

  legend.append('rect').attr('x', width - 43).attr('width', 18).attr('height', 18).style('fill', color);

  legend.append('text').attr('x', width - 49).attr('y', 9).attr('dy', '.35em').style("text-anchor", "end").text(function (d) {
    if (d) return "Allegation of doping";else {
      return "No allegation";
    };
  });

  var tempColor = undefined;
  handle.on('mouseover', function (d, i) {

    tooltip.transition().style('opacity', .9);
    tooltip.attr('data-year', years[i]);

    tooltip.html(data[i].Name).style('left', (d3.event.pageX > 650 ? d3.event.pageX - 85 : d3.event.pageX - 35) + 'px').style('top', d3.event.pageY - 30 + 'px');

    tempColor = this.style.fill;
    d3.select(this).style('opacity', .9).style('fill', 'black');
  }) // end mouseover

  .on('mouseout', function (d) {

    tooltip.transition().style('opacity', 0);

    d3.select(this).style('opacity', 1).style('fill', tempColor);
  });

  handle.transition().attr('cx', function (d, i) {
    return xAxisScale(years[i]) + 20;
  }).attr('cy', function (d, i) {
    return yAxisScale(timeParse(times[i]));
  }).attr('r', 6).delay(function (d, i) {
    return i * 20;
  }).duration(1000).ease(d3.easeElasticOut);
});
/*
  d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, response){
    
  let dataset = response.data; 
    //console.log(response);

  let years = dataset.map((d) => d[0].substr(0, 4));
  let gdpValues = dataset.map((d) => d[1]);
    
  let barWidth = (width-100)/years.length;
  
  let yScale = d3.scaleLinear()
                 .domain([0, d3.max(gdpValues)])
                 .range([0, height-100]);
  
  // Axis setup
  let yAxisScale = d3.scaleLinear()
                 .domain([0, d3.max(gdpValues)])
                 .range([height-50, 50]);
  let yAxis = d3.axisLeft(yAxisScale);
    
  let xAxisScale = 
      d3.scaleLinear()
        .domain([d3.min(years), d3.max(years)])
        .range([50, width-50]);
    
  let xAxis = 
      d3.axisBottom(xAxisScale)
        .tickFormat(d3.format("d"));
    
  chart.append("g")
       .call(yAxis)
       .attr('id', 'y-axis')
       .attr('transform', 'translate(70, 0)');
    
   chart.append("g")
       .call(xAxis)
       .attr('id', 'x-axis')
       .attr('transform', 'translate(20,' + (height - 50) + ")");
    
  let tooltip = d3.select('body').append('div')
      .attr('id', 'tooltip')
      .attr('data-date', '')
      .style('position', 'absolute')
      .style('padding', '0 10px')
      .style('background', 'white')
      .style('opacity', 0);
    
  let colors = d3.scaleLinear()
    .domain([0, gdpValues.length*.33, gdpValues.length*.66, gdpValues.length])
    .range(['#B58929','#C61C6F', '#268BD2', '#85992C']);
  
  let tempColor; 
    
  let handle = chart.selectAll('rect').data(gdpValues).enter()
     .append('rect')
     .attr('class', 'bar')
     .attr('data-date', function(d, i){
       return dataset[i][0];
     })
     .attr('data-gdp', function(d, i){
       return dataset[i][1];
     })
     .style('fill', function(d, i){
       return colors(i);
      })
     .attr('width', barWidth)
     .attr('x', (d, i) => i * barWidth+70)
     .attr('height', 0)
     .attr('y', height-50)
    
  .on('mouseover', function(d, i) {
    let date = dataset[i][0];
    tooltip.transition()
           .style('opacity', .9);
    tooltip
           .attr('data-date', date);//

    tooltip.html( getMonth(parseInt(date.substr(5, 2))) + '\' ' + date.substr(0, 4) + '<br>' + d.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
      .style('left', (d3.event.pageX > 650 ? d3.event.pageX - 150 : d3.event.pageX + 20) + 'px')
      .style('top',  (d3.event.pageY - 50) + 'px')


    tempColor = this.style.fill;
      d3.select(this)
        .style('opacity', .9)
        .style('fill', 'black')
   })// end mouseover

    .on('mouseout', function(d) {
    
        tooltip.transition()
           .style('opacity', 0);
    
        d3.select(this)
            .style('opacity', 1)
            .style('fill', tempColor)
    });
    
    handle.transition()
      .attr('height', (d) => yScale(d))
      .attr('y', (d, i) => height - yScale(d) -50)
      .delay(function(d, i) {
        return i*5;
      })
      .duration(100);
    
  
});// end d3.json


function getMonth(number){
  let months = ['Jan', 'Feb', 'Mar','Apr', 'May',
               'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
               'Nov', 'Dec'];
  return months[number];
}

*/