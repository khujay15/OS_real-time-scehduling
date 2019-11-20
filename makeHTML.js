//Literal Template을 적용했다가 IE에서 돌아가지 않아서 다시 String으로 바꿈
//Task들의 주기와 실행시간을 한 눈에 볼 수 있도록 표로 만듦
function make_periodic_table(periodicTask, HyperPeriod) {
  var PeriodicTable =
    '<div><div style="text-align: center"><p>주기적 Task</p></div> <table style="width: 300px;text-align:left; border: 1px solid black"><tr><th style="padding-right: 10px">이름</th><th style="padding-right: 20px">주기</th><th>수행시간</th><th>색깔</th></tr>';
  for (var i in periodicTask) {
    PeriodicTable =
      PeriodicTable +
      "<tr> <td>" +
      periodicTask[i].pid +
      "</td> <td> " +
      periodicTask[i].period +
      "</td> <td> " +
      periodicTask[i].burstTime +
      "</td>" +
      '<td> <div style="width: 20px; height: 20px;background-color:' +
      periodicTask[i].color +
      ' " />' +
      "</td> </tr>";
  }

  PeriodicTable =
    PeriodicTable + "</table> <p>HyperPeriod: " + HyperPeriod + "</p></div>";

  return PeriodicTable;
}

function make_Aperiodic_table(AperiodicTask) {
  var PeriodicTable =
    '<div style="margin-left:20px"><p style="text-align: center">비주기적 Task</p><table style="width: 150px;text-align:left;border: 1px solid black"><tr><th>도착시간</th><th>수행시간</th></tr>';
  for (var i in AperiodicTask) {
    PeriodicTable =
      PeriodicTable +
      "<tr>" +
      "<td>" +
      AperiodicTask[i].ArrivalTime +
      "</td>" +
      "<td>" +
      AperiodicTask[i].burstTime +
      "</td>" +
      "</tr>";
  }

  PeriodicTable = PeriodicTable + "</table> </div>";

  return PeriodicTable;
}

//앞서 스케쥴링 알고리즘을 적용한 스케쥴 Array를 가지고 색깔블록으로 Gantt Chart를 만듦.
function make_Gantt_chart(Schedule, HyperPeriod) {
  var GanttChart = '<div style="display: flex;flex-direction:row; ">';

  for (var i = 0; i < HyperPeriod; i++) {
    var blockColor;
    if (Schedule[i] !== undefined) blockColor = Schedule[i];
    else blockColor = "#ffffff";
    GanttChart =
      GanttChart +
      '<div style="background-color:' +
      blockColor +
      '; width: 50px; height: 50px; border-bottom:1px solid black "></div>';
  }

  GanttChart =
    GanttChart +
    '</div> <div style="display: flex;flex-direction:row; justify-content: space-between"> <p>0</p><p>' +
    HyperPeriod +
    "</p></div>";

  return GanttChart;
}
