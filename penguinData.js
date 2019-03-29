var data = d3.json("classData.json");
data.then(function(data){
  //var dataThrough2 = getDataUpToDay(data,0);
  //console.log(dataThrough2);
  drawLineChart(data);
  //d3.selectAll("input").on("change", function(){
    //update(parseInt(this.value,10), data);
}
,
function(err){
  console.log(err);
});

day=1;
index=0;

var margins ={
  top:10,
  bottom:50,
  left:10,
  right:10
}

var drawLineChart = function(data)
{
  var listOfClassAverages = [];
  for (var dayNum=0;dayNum<41;dayNum++)
  {
    var dataDay = getDataUpToDay(data, dayNum);
    theSum = dataDay.reduce(getSum);
    listOfClassAverages.push(theSum/23*100);
  }

  var width = 800;
  var height = 400;
  var body = d3.select("body");
  var svg  = body.append("svg")
              .attr("width",width)
              .attr("height",height)
              .classed("svg",true);

  plotWidth = width - margins.left -margins.right;
  plotHeight = height-margins.top-margins.bottom;

  var xScale = d3.scaleLinear()
                 .domain([0,42])
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


  //listOfClassAverages.splice(6,35);
  svg.append("path")
    .attr("transform","translate(20,0)")
    .datum(listOfClassAverages)
    .attr("class","line")
    .attr("d",line)
    .attr("fill","none")
    .attr("stroke","black");

    var svg2 = body.append("svg")
                .attr("width",width)
                .attr("height",height)
                .classed("svg2",true);
    var yScale2 = d3.scaleLinear()
                    .domain([-100,100])
                    .range([plotHeight,0]);

    var listOfZeros = [];
    for(var i=0; i<42;i++)
    {
        listOfZeros.push(0);
    }
    var line2 =d3.line()
                .x(function(d,i){
                  console.log(i+1);
                  return xScale(i+1)})
                .y(function(d){
                  console.log(d);
                  return yScale2(d)});

      svg2.append("path")
        .attr("transform","translate(20,"+(margins.top)+")")
        .datum(listOfZeros)
        .attr("class","line")
        .attr("d",line2)
        .attr("fill","none")
        .attr("stroke","red");

        var xAxis2 = d3.axisBottom(xScale);
        var yAxis2 = d3.axisLeft(yScale2);

        var colors = d3.scaleOrdinal(d3.schemeDark2);


        svg2.append("g").classed("yAxis",true)
                  .call(yAxis2)
                  .attr("transform","translate("+(margins.left+15)+","+(margins.top)+")");
        svg2.append("g").classed("xAxis",true)
                  .call(xAxis2)
                  .attr("transform","translate("+(margins.left+35)+","+(margins.top+plotHeight)+")");

        drawDifferenceLineForPenguin(listOfClassAverages,data[0],colors)
        drawDifferenceLineForPenguin(listOfClassAverages,data[7],colors)
        drawDifferenceLineForPenguin(listOfClassAverages,data[11],colors)
        drawDifferenceLineForPenguin(listOfClassAverages,data[22],colors)
        drawDifferenceLineForPenguin(listOfClassAverages,data[1],colors)
        drawDifferenceLineForPenguin(listOfClassAverages,data[9],colors)

        d3.select("body").selectAll("input")
          .data(data)
          .enter()
          .append("label")
          .text(function(d){return d.picture;})
          .append("input")
          .attr("type","checkbox")
          .attr("value", function(d) {return d.picture;})



}

var drawDifferenceLineForPenguin = function(listOfClassAverages,penguin,colors)
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
      listOfDifferences.push((((d*100)/listOfClassAverages[i])-1)*100)
  })

  var width = 800;
  var height = 400;
  plotWidth = width - margins.left -margins.right;
  plotHeight = height-margins.top-margins.bottom;

  var xScale = d3.scaleLinear()
                 .domain([0,42])
                 .range([0,plotWidth]);

 var yScale = d3.scaleLinear()
                .domain([0,100])
                .range([plotHeight,0]);

 var yScale2 = d3.scaleLinear()
                 .domain([-100,100])
                 .range([plotHeight,0]);

 var line =d3.line()
             .x(function(d,i){
               return xScale(i+1)})
             .y(function(d){
               return yScale(d*100)});

  var line2 =d3.line()
              .x(function(d,i){
                console.log(i+1);
                return xScale(i+1)})
              .y(function(d){
                console.log(d);
                return yScale2(d)});

  d3.select(".svg2").append("path")
    .attr("transform","translate(20,"+(margins.top)+")")
    .datum(listOfDifferences)
    .attr("class","line")
    .attr("d",line2)
    .attr("fill","none")
    .attr("stroke",function(d){return colors(penguin.picture)});

   d3.select(".svg").append("path")
     .attr("transform","translate(20,"+(margins.top)+")")
     .datum(listOfPenguinGrades)
     .attr("class","line")
     .attr("d",line)
     .attr("fill","none")
     .attr("stroke",function(d){return colors(penguin.picture)});


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


  if (hwGradeForPenguin===-1)
  {
    return (quizGradeForPenguin);

  }
  else if(testGradeForPenguin===-1)
  {
    return ((quizGradeForPenguin*.5)+(hwGradeForPenguin*.5));

  }
  else if (finalGrade===-1)
  {
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
