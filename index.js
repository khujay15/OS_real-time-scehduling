var CreateButton = document.getElementById("createGanttChart");
CreateButton.addEventListener("click", main);

function main(event) {
  // 빨주노초파남 까지의 색깔 Hex값. 나중에 Gantt차트를 만들 때 컬러블록으로 들어갈예정.
  var Palette = [
    "#ff0000",
    "#ff7f00",
    "#ffff00",
    "#00ff00",
    "#0000ff",
    "#4B0082"
  ];

  //사용자에게 입력받은 주기적 Task와 비주기적 Task를 가져옴.비주기적 Task는 3보다 작을 수 없도록 작성.
  var numAperiodicTask = document.getElementById("numAperiodicTask").value;
  var numPeriodicTask = document.getElementById("numPeriodicTask").value;
  if (numAperiodicTask < 3) numAperiodicTask = 3;

  //HyperPeriod의 값이 너무 커지지 않도록 방지하기 위해서, 각 주기가 배수관계를 이루도록 계수를 생성.
  var rank = new Array();
  rank[0] = 1;
  for (var i = 1; i < numPeriodicTask; i++) {
    rank[i] = 2 * i;
  }
  var randomPeriod = Math.floor(Math.random() * 10) + 15; // [15~25] 까지의 수

  //주기적 Task를 지니고 있는 배열.
  // 주기, 수행시간, pid, 컬러값을 가지는 객체를 담는 배열
  var periodicTask = new Array();
  for (var i = 0; i < numPeriodicTask; i++) {
    periodicTask[i] = {
      period: randomPeriod * rank[i],
      burstTime: Math.floor(Math.random() * 2 * rank[i]) + 1,
      pid: "P" + i,
      color: Palette[i]
    };
  }

  //비주기적 Task. Worst Case의 경우에도 제한시간 내에 끝마치기 위해 도착시간과 수행시간을 제한된 범위 내에서 랜덤으로 만듦.
  var AperiodicTask = new Array();
  AperiodicTask = calc_AperiodicTask(periodicTask, numAperiodicTask);

  var HyperPeriod = calc_HyperPeriod(periodicTask);

  // schedule배열 생성
  var PollingSchedule = new Array(HyperPeriod);
  var DeferrableSchedule = new Array(HyperPeriod);

  //평균대기시간 계산
  var PollingAverageWaitingTime = schedulingPolling(
    periodicTask,
    JSON.parse(JSON.stringify(AperiodicTask)),
    PollingSchedule
  );
  var DeferrableAverageWaitingTime = schedulingDeferrable(
    periodicTask,
    JSON.parse(JSON.stringify(AperiodicTask)),
    DeferrableSchedule
  );

  // Task표 생성
  var PeriodicTable = make_periodic_table(periodicTask, HyperPeriod);
  var AperiodicTable = make_Aperiodic_table(AperiodicTask);

  // GanttChart 생성
  var PollingGanttChart = make_Gantt_chart(PollingSchedule, HyperPeriod);
  var DeferrableGanttChart = make_Gantt_chart(DeferrableSchedule, HyperPeriod);

  document.getElementById("tasktable").innerHTML =
    '<div style="display:flex;flex-direction:row;margin-bottom: 20px">' +
    PeriodicTable +
    AperiodicTable +
    "</div>";

  document.getElementById("polling").innerHTML =
    "<p>1. Polling Server</p> <p>Average Waiting Time: " +
    PollingAverageWaitingTime / AperiodicTask.length +
    "</p> " +
    PollingGanttChart;

  document.getElementById("deferrable").innerHTML =
    "<p>2. Deferralbe Server </p> <p>Average Waiting Time: " +
    +DeferrableAverageWaitingTime / AperiodicTask.length +
    "</p>" +
    DeferrableGanttChart;
}
