var data = d3.json("classData.json");
data.then(function(data){
  //var dataThrough2 = getDataUpToDay(data,0);
  //console.log(dataThrough2);
  var colors = d3.scaleOrdinal(d3.schemeDark2);
  drawLineChart(data,colors);
  d3.select("body").selectAll("input").on("change", function(d,i){
    changeSVGS(data,this, colors);});

  d3.select("body").append("form")
    .text("Change to day between 1 and 41: ")
    .append("input")
    .attr("type","text")
    .attr("id","newDay");

  d3.select("form").append("button")
    .text("Go To")
    .attr("type","button")
    .on("click",function(d,i){changeToDay(data);});
}
,
function(err){
  console.log(err);
});

day=1;
index=0;

var margins ={
  top:20,
  bottom:50,
  left:50,
  right:10
}

var drawLineChart = function(data,colors)
{
  var listOfClassAverages = getClassAverages(data);


  var width = 800;
  var height = 400;
  var body = d3.select("body");
  var svg  = body.append("svg")
              .attr("width",width)
              .attr("height",height)
              .classed("svg",true);

  var title = svg.append("text")
          .text("Average Grade Over Time")
          .attr("x",((width/2)-30))
          .attr("y", margins.top-5);
  var yLabel = svg.append("text")
  .text("Cumulative Grade Percentage")
  .attr("x",margins.left-45)
  .attr("y", (height+50)/2)
  .attr("transform","translate(15,0) rotate(-90,"+(margins.left-45)+","+((height+50)/2)+")");

  var xLabel = svg.append("text")
  .text("Day")
  .attr("x",(width/2)+50)
  .attr("y", (height-10));

  plotWidth = width - margins.left -margins.right;
  plotHeight = height-margins.top-margins.bottom;

  var xScale = d3.scaleLinear()
                 .domain([1,42])
                 .range([0,plotWidth]);
  var yScale = d3.scaleLinear()
                 .domain([0,100])
                 .range([plotHeight,0]);
 var xAxis = d3.axisBottom(xScale);

 var yAxis = d3.axisLeft(yScale);



 svg.append("g").classed("yAxis",true)
           .call(yAxis)
           .attr("transform","translate("+(margins.left+15)+","+(margins.top)+")");
 svg.append("g").classed("xAxis",true)
           .call(xAxis)
           .attr("transform","translate("+(margins.left+35)+","+(margins.top+plotHeight)+")");


  var line =d3.line()
              .x(function(d,i){
                return xScale(i+1)})
              .y(function(d){
                return yScale(d)});

  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


  //listOfClassAverages.splice(6,35);
  svg.append("path")
    .attr("transform","translate(80,0)")
    .datum(listOfClassAverages)
    .attr("class","line")
    .attr("id","ClassAvg")
    .attr("d",line)
    .attr("fill","none")
    .attr("stroke","black")
    .attr("stroke-width",3)
    .on("mouseover", function(d) {

      d3.select("#ClassAvg")
        .attr("d",line);

    d3.select(this)
      .transition()
      .duration(200)
      .attr("stroke-width",6)
    div.transition()
        .duration(200)
        .style("opacity", .9);
    div .html("Class Average")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
.on("mouseout", function(d) {
    div.transition()
        .duration(500)
        .style("opacity", 0);

    d3.select(this)
      .transition()
      .duration(200)
      .attr("stroke-width",3);
});




    var svg2 = body.append("svg")
                .attr("width",width)
                .attr("height",height)
                .classed("svg2",true);
    var yScale2 = d3.scaleLinear()
                    .domain([-30,60])
                    .range([plotHeight,0]);

    var title = svg2.append("text")
            .text("Change Ratio In Comparison To Previous Day")
            .attr("x",((width/2)-30))
            .attr("y", margins.top-5);
    var yLabel = svg2.append("text")
    .text("Percent Difference")
    .attr("x",margins.left-45)
    .attr("y", (height+50)/2)
    .attr("transform","translate(15,0) rotate(-90,"+(margins.left-45)+","+((height+50)/2)+")");

    var xLabel = svg2.append("text")
    .text("Day")
    .attr("x",(width/2)+50)
    .attr("y", (height-10));

    var listOfZeros = [];
    for(var i=0; i<42;i++)
    {
        listOfZeros.push(0);
    }
    var line2 =d3.line()
                .x(function(d,i){
                //  console.log(i+1);
                  return xScale(i+1)})
                .y(function(d){
                  //console.log(d);
                  return yScale2(d)});


        var xAxis2 = d3.axisBottom(xScale);
        var yAxis2 = d3.axisLeft(yScale2);



        svg2.append("g").classed("yAxis",true)
                  .call(yAxis2)
                  .attr("transform","translate("+(margins.left+15)+","+(margins.top)+")");
        svg2.append("g").classed("xAxis",true)
                  .call(xAxis2)
                  .attr("transform","translate("+(margins.left+35)+","+(margins.top+plotHeight)+")");


          d3.select("body").append("br");


          var checkBoxList=[]

        d3.select("body").append("g").selectAll("input")
          .data(data)
          .enter()
          .append("input")
          .attr("type","checkbox")
          .attr("value", function(d,i) {return i;})
          .attr("name",function(d,i) {return d.picture;})
          .attr("id", function(d,i){return "input"+i;})

          .each(function(d){checkBoxList.push(this);});


        var checkboxes = d3.selectAll("input");
        d3.select("body")
        .append("g")
        .classed("pictures",true)
          .selectAll("img")
          .data(checkBoxList)
          .enter()
          .append("img")
          .attr("id", function(d){return d.name.slice(0,-10)})
          .attr("height",65)
          .attr("width",65)
          .attr("src", function(d,i){
            console.log(d);
            return "penguins/"+d.name;
          })
          .attr("alt","Penguin Picture")
          .on("click",function(d,i){
            if (d.checked==false){
              d.checked=true;
              changeSVGS(data,d,colors);
              this.style.borderColor=colors(d.name);
            }
            else{
              d.checked=false;
              changeSVGS(data,d,colors);
              this.style.borderColor="black";

            }
          })
          .attr("transform","translate(120,0)");





          d3.select(".pictures")
          .append("img")
          .attr("id","Whole Class")
          .attr("height",65)
          .attr("width",65)
          .attr("src", "penguins/class.png")
          .attr("alt","Class of Penguins")
          .on("click",function(d,i){

            if (this.selected==false || this.selected==undefined)
            {
              console.log("false");
              this.selected=true;
              checkBoxList.forEach(function(d,i)
              {
                d.checked=true;
                changeSVGS(data,d,colors);
                d3.select(d.name)

              })
            }

            else{
              console.log("true");

              this.selected=false;
              checkBoxList.forEach(function(d,i)
              {
                d.checked=false;
                changeSVGS(data,d,colors);
              })

            }
          })





          var gradesDay15 = getDataUpToDay(data,16);
        //  console.log(gradesDay15);
          d3.select("body").append("br");


          var svg3 = body.append("svg")
                      .attr("width",width)
                      .attr("height",height)
                      .classed("svg3",true);



        var title = svg3.append("text")
                .text("Cumulative Grade Distribution For Day")
                .attr("x",((width/2)-30))
                .attr("y", margins.top-5);
        var yLabel = svg3.append("text")
        .text("Proportion of Students")
        .attr("x",margins.left-45)
        .attr("y", (height+50)/2)
        .attr("transform","translate(15,0) rotate(-90,"+(margins.left-45)+","+((height+50)/2)+")");

        var xLabel = svg3.append("text")
        .text("Grade")
        .attr("x",(width/2)+50)
        .attr("y", (height-10));


          var xScaleHist = d3.scaleLinear()
                         .domain([0,1])//d3.min(gradesDay15), d3.max(gradesDay15)])
                         .nice()
                         .range([0, plotWidth])
          var numBars=5;
         var binMaker = d3.histogram()
                          .domain(xScaleHist.domain())
                          .thresholds(numBars);

        var barWidth=plotWidth/numBars;
        var bins = binMaker(gradesDay15);
        var percentage = function(d){
          return d.length/gradesDay15.length;
        }

        var yScaleHist = d3.scaleLinear()
                       .domain([0, d3.max(bins, function(d){ return percentage(d); })])
                       .nice()
                       .range([plotHeight, margins.top]);


      //console.log(bins);
       var plot = svg3.append('g')
       .classed('plot', true);

       var frequency_rects = plot.selectAll('rect')
                         .data(bins)
                         .enter()
                         .append('rect')
                         .attr('x', function(d,i){ return xScaleHist((i)/numBars)  ; })
                         .attr('y', function(d){ return yScaleHist(percentage(d))}) // Percentage returns the amount of values in each bin divided by the total amount of the array.
                         .attr('width', function(d){
                               return (barWidth-1)
                             })
                         .attr('height', function(d){
                          // console.log(percentage(d));
                           return (plotHeight - yScaleHist(percentage(d))); })
                         .attr('fill', 'blue');

      var xAxis = d3.axisBottom(xScaleHist);
      var yAxis = d3.axisLeft(yScaleHist);
      plot.attr("transform","translate("+(margins.left+20)+",10)")

      svg3.append("g").classed("yAxis",true)
                .call(yAxis)
                .attr("transform","translate("+(margins.left+20)+","+(margins.top)+")");
      svg3.append("g").classed("xAxis",true)
                .call(xAxis)
                .attr("transform","translate("+(margins.left+20)+","+(margins.top+plotHeight+5)+")");

}

var changeToDay = function(data)
{
//  console.log("called");
  var input = document.getElementById("newDay").value;
  //console.log(input);
  updateScreen(input,data);
  document.getElementById("newDay").value = "";
}



var updateScreen = function(index, data)
{
          //  console.log(index);
            var gradesDay = getDataUpToDay(data, parseInt(index)+1);
          //  console.log(gradesDay);
            body = d3.select("body");
            var width = 800;
            var height = 400;
            plotWidth = width - margins.left -margins.right;
            plotHeight = height-margins.top-margins.bottom;


            var svg3 = body.select(".svg3")
            var xScaleHist = d3.scaleLinear()
                           .domain([0,1])//d3.min(gradesDay), d3.max(gradesDay)])
                           .nice()
                           .range([0, plotWidth])
            var numBars=5;
           var binMaker = d3.histogram()
                            .domain(xScaleHist.domain())
                            .thresholds(numBars);

          var barWidth=plotWidth/numBars;
          var bins = binMaker(gradesDay);
          var percentage = function(d){
            return d.length/gradesDay.length;
          }

          var yScaleHist = d3.scaleLinear()
                         .domain([0, d3.max(bins, function(d){ return percentage(d); })])
                         .nice()
                         .range([plotHeight, margins.top]);


      //  console.log(bins);
         var plot = svg3.select('g');
         var frequency_rects = plot.selectAll('rect')
                           .data(bins)
                           .transition()
                            .duration(1000)
                            .ease(d3.easeCubic)
                           .attr('x', function(d,i){ return xScaleHist((i)/numBars); })
                           .attr('y', function(d){ return yScaleHist(percentage(d))}) // Percentage returns the amount of values in each bin divided by the total amount of the array.
                           .attr('width', function(d){
                                 return (barWidth-1)
                               })
                           .attr('height', function(d){
                          //   console.log(percentage(d));
                             return (plotHeight - yScaleHist(percentage(d))); })
                           .attr('fill', 'blue');

        plot.attr("transform","translate("+(margins.left+20)+",10)")

}

var getClassAverages = function(data)
{
  var listOfClassAverages = [];
  for (var dayNum=0;dayNum<41;dayNum++)
  {
    var dataDay = getDataUpToDay(data, dayNum);
    theSum = dataDay.reduce(getSum);
    listOfClassAverages.push(theSum/23*100);
  }
  return listOfClassAverages;
}



var changeSVGS = function(data, checkbox,colors)
{

  var peng = data[checkbox.value];
  var listOfClassAverages = getClassAverages(data);
  if (checkbox.checked == true)
  {
  //  console.log("called change   line"+peng.picture);
    drawLinesForPenguin(listOfClassAverages,peng,colors);
  }
  else {
    document.getElementById("line"+peng.picture).remove();
    document.getElementById("line"+peng.picture).remove();

  }
}





var drawLinesForPenguin = function(listOfClassAverages,penguin,colors)
{
  var listOfPenguinGrades = [];
  for (var dayNum=0;dayNum<41;dayNum++)
  {
    var dataDay = getPenguinGrade(penguin,dayNum);
    listOfPenguinGrades.push(dataDay);
  }

  var listOfDifferences = [];
  listOfPenguinGrades.forEach(function(d,i)
  {
      if (i===0)
      {
        listOfDifferences.push(0)
      }
      else{
        listOfDifferences.push((listOfPenguinGrades[i]/listOfPenguinGrades[i-1])-1)
      }
  })

  var width = 800;
  var height = 400;
  plotWidth = width - margins.left -margins.right;
  plotHeight = height-margins.top-margins.bottom;

  var xScale = d3.scaleLinear()
                 .domain([1,42])
                 .range([0,plotWidth]);

 var yScale = d3.scaleLinear()
                .domain([0,100])
                .range([plotHeight,0]);

 var yScale2 = d3.scaleLinear()
                 .domain([-.3,.6])
                 .range([plotHeight,0]);

 var line =d3.line()
             .x(function(d,i){
               return xScale(i+1)})
             .y(function(d){
               return yScale(d*100)});

  var line2 =d3.line()
              .x(function(d,i){
        //        console.log(i+1);
                return xScale(i+1)})
              .y(function(d){
      //          console.log(d);
                return yScale2(d)});

  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  d3.select(".svg2").append("path")
    .attr("transform","translate(85,"+(margins.top)+")")
    .datum(listOfDifferences)
    .attr("class","line")
    .attr("d",line2)
    .attr("value",function(d,i){return "line"+penguin.picture})
    .attr("fill","none")
    .attr("stroke",function(d){return colors(penguin.picture)})
    .attr("stroke-width",3)
    .attr("id",function(d){return "line"+penguin.picture})
    .on("mouseover", function(d) {
        var theLength = d3.select(".svg2").selectAll(".line")
        .size();

      d3.select(this)
        .transition()
        .duration(200)
        .attr("stroke-width",6)
    div.transition()
        .duration(200)
        .style("opacity", .9);
    div .html(function(d) {return penguin.picture.slice(0,-10)})
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");

      if (theLength<2)
      {
              var makeAreaPos = d3.area()
                          .x(function(d,i){
                            return xScale(i+1);
                          })
                          .y0(function(d){return yScale2(d);})
                          .y1(function(d){return yScale2(0);})
            var makeAreaNeg = d3.area()
                        .x(function(d,i){
                          return xScale(i+1);
                        })
                        .y1(function(d){return yScale2(d);})
                        .y0(function(d){return yScale2(0);})

          d3.select(".svg2").append("path")
            .attr("transform","translate(85,"+(margins.top)+")")
            .datum(listOfDifferences)
            .attr("class","area")
            .attr("d",makeAreaNeg)
            .attr("fill",function(d){
                return "red";
              }
            );
            d3.select(".svg2").append("path")
              .attr("transform","translate(85,"+(margins.top)+")")
              .datum(listOfDifferences)
              .attr("class","area")
              .attr("d",makeAreaPos)
              .attr("fill",function(d){
                  return "blue";
                }
              );




      }

    })
.on("mouseout", function(d) {
  d3.select(this)
    .transition()
    .duration(200)
    .attr("stroke-width",3)

    div.transition()
        .duration(500)
        .style("opacity", 0);
    var theLength = d3.select(".svg2").selectAll(".line")
        .size();
    if (theLength<2)
    {
      console.log("removing");
      d3.select(".svg2").selectAll(".area").remove();
    //  document.getElementsByClassName("area").remove();
      //document.getElementsByClassName("area").remove();

    }
});
    //.attr("transform","translate(0,0)");


   d3.select(".svg").append("path")
     .attr("transform","translate(80,"+(margins.top)+")")
     .datum(listOfPenguinGrades)
     .attr("class","line")
     .attr("value",function(d,i){return "line"+i})
     .attr("d",line)
     .attr("fill","none")
     .attr("stroke",function(d){return colors(penguin.picture)})
     .attr("stroke-width",3)
     .attr("id",function(d){return "line"+penguin.picture})
     .on("mouseover", function(d) {

       d3.select(this)
         .transition()
         .duration(200)
         .attr("stroke-width",6)
     div.transition()
         .duration(200)
         .style("opacity", .9);
     div .html(function(d){return penguin.picture.slice(0,-10)})
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
     })
 .on("mouseout", function(d) {
     div.transition()
         .duration(500)
         .style("opacity", 0);

         d3.select(this)
           .transition()
           .duration(200)
           .attr("stroke-width",3)
 });



}

function getSum(total, num) {
  return total + num;
}



var getPenguinGrade = function(penguin,indexOfDay)
{
  d = penguin;
  quizGradeForPenguin = getQuizzesForPenguin(d,indexOfDay);
  var hwGradeForPenguin = 0;
  // get homework grade
  if (indexOfDay>0)
  {
    hwGradeForPenguin = getHwForPenguin(d,indexOfDay);
  }
  else {
    hwGradeForPenguin=-1;
  }
  // test grades
  var testGradeForPenguin = 0;
  if (indexOfDay>13)
  {
    testGradeForPenguin = getTestForPenguin(d,indexOfDay);
  }
  else {
  testGradeForPenguin=-1;
  }


  // final
  finalGrade=0;
  if (indexOfDay===40)
  {
    finalGrade = getFinalForPenguin(d,indexOfDay);
  }
  else {
    finalGrade=-1;
  }
//  console.log(indexOfDay);

  if (hwGradeForPenguin===-1)
  {
    return (quizGradeForPenguin);

  }
  else if(testGradeForPenguin===-1)
  {
  //  console.log("called 2 part grade");
    return ((quizGradeForPenguin*.5)+(hwGradeForPenguin*.5));

  }
  else if (finalGrade===-1)
  {
  //  console.log("called 3 part grade");
    if (indexOfDay<29)
    {
      return ((quizGradeForPenguin*.3)+(hwGradeForPenguin*.3)+(testGradeForPenguin*.4));

    }
    else
    {
      return ((quizGradeForPenguin*(3/14))+(hwGradeForPenguin*(3/14))+(testGradeForPenguin*(4/7)));
    }
  }
  else
  {
    return ((quizGradeForPenguin*.15)+(hwGradeForPenguin*.15)+(testGradeForPenguin*.4)+ (finalGrade*.3));

  }

}



var getQuizzesForPenguin = function(penguin,indexOfDay)
{

    var quizGradeForPenguin = 0;
    var totalPoints = 0;
    penguin.quizes.forEach(function(d)
    {
      if (d.day-1<=indexOfDay)
      {
        //console.log(d.day);
        quizGradeForPenguin+=d.grade;
        totalPoints+=d.max;
      }
    })
    quizGradeForPenguin/=totalPoints;
    return quizGradeForPenguin;
}



var getHwForPenguin = function(penguin,indexOfDay)
{
  totalPoints = 0;
  hwGradeForPenguin=0;
  penguin.homework.forEach(function(d)
  {
    if (d.day-1<=indexOfDay)
    {
      hwGradeForPenguin+=d.grade;
      totalPoints+=d.max;
    }
  })
  hwGradeForPenguin/=totalPoints;
  return hwGradeForPenguin;
}


var getFinalForPenguin = function(penguin,indexOfDay)
{
  return penguin.final[0].grade/penguin.final[0].max;
}


var getTestForPenguin = function(penguin, indexOfDay)
{
  var testGradeForPenguin = 0;
  var totalPoints = 0;
  penguin.test.forEach(function(d)
  {
    if (d.day-1<=indexOfDay)
    {
      testGradeForPenguin+=d.grade;
      totalPoints+=d.max;
    }
  })
  testGradeForPenguin/=totalPoints;
  return testGradeForPenguin;
}



var getDataUpToDay = function(data,indexOfDay)
{
  var listTotalGrades=[];
  data.forEach(function(d)
  {
    var eachPenguinGrade = getPenguinGrade(d,indexOfDay);
    listTotalGrades.push(eachPenguinGrade);
  })
  return listTotalGrades;

}
