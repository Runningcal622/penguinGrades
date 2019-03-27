var data = d3.json("classData.json");
data.then(function(data){
  //var dataThrough2 = getDataUpToDay(data,0);
  //console.log(dataThrough2);
  drawLineChart(data);
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
    listOfClassAverages.push(theSum/23);
  }
  console.log(listOfClassAverages);

  var width = 800;
  var height = 800;
  var body = d3.select("body");
  var svg  = body.append("svg")
              .attr("width",width)
              .attr("height",height);

  width = width - margins.left -margins.right;
  height = height-margins.top-margins.bottom;

  var xScale = d3.scaleLinear()
                 .domain([0,42])
                 .range([0,width]);
  var yScale = d3.scaleLinear()
                 .domain([0,1])
                 .range([height,0]);

  var line =d3.line()
              .x(function(d,i){return xScale(i+1)})
              .y(function(d){return yScale(d)});

  svg.append("path")
    .datum(listOfClassAverages)
    .attr("class","line")
    .attr("d",line);












}

function getSum(total, num) {
  return total + num;
}

var getDataUpToDay = function(data,indexOfDay)
{
  var listTotalGrades=[];
  data.forEach(function(d,i)
  {
    // get quiz grade
    var quizGradeForPenguin = 0;
    var totalPoints = 0;
    d.quizes.forEach(function(d)
    {
      if (d.day-1<=indexOfDay)
      {
        //console.log(d.day);
        quizGradeForPenguin+=d.grade;
        totalPoints+=d.max;
      }
    })
    quizGradeForPenguin/=totalPoints;


    var hwGradeForPenguin = 0;
    // get homework grade
    if (indexOfDay>0)
    {
    totalPoints = 0;
    d.homework.forEach(function(d)
    {
      if (d.day-1<=indexOfDay)
      {
        hwGradeForPenguin+=d.grade;
        totalPoints+=d.max;
      }
    })
    hwGradeForPenguin/=totalPoints;


    var testGradeForPenguin = 0;
    }
    else {
      hwGradeForPenguin=-1;
    }
    // test grades

    if (indexOfDay>13)
    {
      var testGradeForPenguin = 0;
      var totalPoints = 0;
      d.test.forEach(function(d)
      {
        if (d.day-1<=indexOfDay)
        {
          testGradeForPenguin+=d.grade;
          totalPoints+=d.max;
        }
      })
      testGradeForPenguin/=totalPoints;
    }
  else {
    testGradeForPenguin=-1;
  }

    // final
    finalGrade=0;
    if (indexOfDay===40)
    {
      finalGrade=d.final[0].grade/d.final[0].max;
    }
    else {
      finalGrade=-1;
    }


    if (hwGradeForPenguin===-1)
    {
      listTotalGrades.push(quizGradeForPenguin);

    }
    else if(testGradeForPenguin===-1)
    {
      listTotalGrades.push((quizGradeForPenguin*.5)+(hwGradeForPenguin*.5));

    }
    else if (finalGrade===-1)
    {
      if (indexOfDay<29)
      {
        listTotalGrades.push((quizGradeForPenguin*.3)+(hwGradeForPenguin*.3)+(testGradeForPenguin*.4));

      }
      else
      {
        listTotalGrades.push((quizGradeForPenguin*(3/14))+(hwGradeForPenguin*(3/14))+(testGradeForPenguin*(4/7)));
      }
    }
    else
    {
      listTotalGrades.push((quizGradeForPenguin*.15)+(hwGradeForPenguin*.15)+(testGradeForPenguin*.4)+ (finalGrade*.3));

    }
  })
  return listTotalGrades;

}
