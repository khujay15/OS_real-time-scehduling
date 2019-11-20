/**
 *
 * @param {*} Task 현재 스케쥴링하려고 하는 Task
 * @param {*} AperiodicTask 비주기적 Task 배열
 * @param {*} section 스케쥴링 시작 시간대
 * @param {*} TaskSchedule 스케쥴결과배열
 * @returns PollingServer가 스케쥴링 가능하면 true, 아니면 False
 */
function isPolling(Task, AperiodicTask, section, TaskSchedule) {
  if (
    Task.isServer === true && // 1. 현재 스케쥴링하고있는 Task가 서버의 Task이고
    AperiodicTask.length > 0 && // 2. 비주기적 Task가 아직 남아있으며
    AperiodicTask[0].ArrivalTime <= section && // 3. 비주기적 Task의 도착시간이 지금 실행할 시간대보다 미리 도착해있으며
    TaskSchedule === undefined // 4. 해당 시간에 다른 Task가 미리 스케쥴링이 되어있지 않으면 스케쥴 가능
  )
    return true;
  else return false;
}

/**
 *
 * @param {*} periodicTask 주기적 Task 배열
 * @param {*} AperiodicTask 비주기적 Task 배열
 * @param {*} TaskSchedule 스케쥴링 결과 배열
 * @returns 총 WaitingTime
 */
function schedulingPolling(periodicTask, AperiodicTask, TaskSchedule) {
  //PollingServer를 포함한 주기의 최소공배수
  var HyperPeriodIncludePolling = calc_HyperPeriod(periodicTask);
  var WaitingTime = 0;
  // 주기를 기준으로 오름차순으로 정렬.
  periodicTask.sort(function(a, b) {
    return a.period < b.period ? -1 : a.period > b.period ? 1 : 0;
  });

  for (var ps in periodicTask) {
    //HyperPeriod 안에 해당 Task가 몇번 실행되는지
    var NumActive = HyperPeriodIncludePolling / periodicTask[ps].period;
    for (var j = 0; j < NumActive; j++) {
      //한 주기에 실행할 수 있는 양
      var jobPerPeriod = periodicTask[ps].burstTime;
      //힌 주기의 시작과 끝(=다음주기의 시작)
      var section = j * periodicTask[ps].period;
      var sectionNext = (j + 1) * periodicTask[ps].period;

      for (var t = section; t < sectionNext; t++) {
        //PollingServer의 스케쥴링
        if (
          isPolling(periodicTask[ps], AperiodicTask, section, TaskSchedule[t])
        ) {
          //Server의 컬러블록은 검은색으로 통일
          TaskSchedule[t] = "#000000";
          //마지막으로 실행된 시각에서 현재시각을 빼서 기다린 시간 계산. 그 후 시간갱신, 남은 작업량 갱신
          WaitingTime = WaitingTime + (t - AperiodicTask[0].LastTaskTime);
          AperiodicTask[0].LastTaskTime = t + 1;
          AperiodicTask[0].burstTime = AperiodicTask[0].burstTime - 1;
          jobPerPeriod = jobPerPeriod - 1;

          //모든 작업이 끝난 비주기적 Task 배열의 원소는 삭제. 오름차순으로 정렬했기에 항상 첫번째 원소를 관리하면됨
          if (AperiodicTask[0].burstTime == 0) AperiodicTask.shift();
          //비주기적 배열이 모두 스케쥴링 되었거나 한 주기에 실행할 수 있는 양이 없으면 종료
          if (AperiodicTask.length == 0 || jobPerPeriod == 0) break;
        }
        //Periodic Task의 스케쥴링. 아직 스케쥴링 되어있지않은 곳에 스케쥴링 가능
        else if (TaskSchedule[t] === undefined && !periodicTask[ps].isServer) {
          //자신의 색깔값을 스케쥴링 결과배열에 채움.
          TaskSchedule[t] = periodicTask[ps].color;
          jobPerPeriod = jobPerPeriod - 1;

          if (jobPerPeriod == 0) break;
        }
      }
    }
  }

  console.log("After PollingScheduling: ", TaskSchedule);
  console.log("Polling TotalWaitingTime: ", WaitingTime);

  return WaitingTime;
}

/**
 *
 * @param {*} Task 현재 스케쥴링하려고 하는 Task
 * @param {*} AperiodicTask 비주기적 Task 배열
 * @param {*} sectionNext 스케쥴링 마감 시간대
 * @param {*} TaskSchedule 스케쥴결과배열
 * @param {*} time 스케쥴링 하려는 시간대.스케쥴결과배열의 인덱스
 * @returns DeferrableServer가 해당시간에 스케쥴링 가능하면 true, 아니면 false
 */
function isDeferrable(Task, AperiodicTask, sectionNext, TaskSchedule, time) {
  if (
    Task.isServer === true && // 1. 현재 스케쥴링하고있는 Task가 서버의 Task이고
    AperiodicTask.length > 0 && // 2. 비주기적 Task가 아직 남아있으며
    AperiodicTask[0].ArrivalTime < sectionNext && // 3. 비주기적 Task의 도착시간이 앞으로 실행할 시간대 안에 도착해있으며
    time >= AperiodicTask[0].ArrivalTime && // 4. 비주기적 Task의 도착시간보다 늦게 Task가 실행되어야하고
    TaskSchedule === undefined // 5. 해당 시간에 다른 Task가 미리 스케쥴링이 되어있지 않아야함
  )
    return true;
  else return false;
}

/**
 *
 * @param {*} periodicTask 주기적 Task 배열
 * @param {*} AperiodicTask 비주기적 Task 배열
 * @param {*} TaskSchedule 스케쥴링 결과 배열
 * @returns 총 WaitingTime
 */
function schedulingDeferrable(periodicTask, AperiodicTask, TaskSchedule) {
  //PollingServer를 포함한 주기의 최소공배수
  var HyperPeriodIncludePolling = calc_HyperPeriod(periodicTask);
  var WaitingTime = 0;

  // 주기를 기점으로 오름차순 정렬.
  periodicTask.sort(function(a, b) {
    return a.period < b.period ? -1 : a.period > b.period ? 1 : 0;
  });

  for (var ps in periodicTask) {
    //HyperPeriod 안에 해당 Task가 몇번 실행되는지
    var NumActive = HyperPeriodIncludePolling / periodicTask[ps].period;
    for (var j = 0; j < NumActive; j++) {
      // 한 주기에 실행할 수 있는 양
      var jobPerPeriod = periodicTask[ps].burstTime;
      //힌 주기의 시작과 끝(=다음주기의 시작)
      var section = j * periodicTask[ps].period;
      var sectionNext = (j + 1) * periodicTask[ps].period;

      for (var t = section; t < sectionNext; t++) {
        //Deferrable 서버의 스케쥴링
        if (
          isDeferrable(
            periodicTask[ps],
            AperiodicTask,
            sectionNext,
            TaskSchedule[t],
            t
          )
        ) {
          //Server의 컬러블록을 검은색으로 통일
          TaskSchedule[t] = "#000000";
          //마지막으로 실행된 시각에서 현재시각을 빼서 기다린 시간 계산. 그 후 시간갱신, 남은 작업량 갱신
          WaitingTime = WaitingTime + (t - AperiodicTask[0].LastTaskTime);
          AperiodicTask[0].LastTaskTime = t + 1;
          AperiodicTask[0].burstTime = AperiodicTask[0].burstTime - 1;
          jobPerPeriod = jobPerPeriod - 1;

          //모든 작업이 끝난 비주기적 Task 배열의 원소는 삭제. 오름차순으로 정렬했기에 항상 첫번째 원소를 관리하면됨
          if (AperiodicTask[0].burstTime == 0) {
            AperiodicTask.shift();
          }
          //비주기적 배열이 모두 스케쥴링 되었거나 한 주기에 실행할 수 있는 양이 없으면 종료
          if (AperiodicTask.length == 0 || jobPerPeriod == 0) break;
        }
        //Periodic Task의 스케쥴링
        else if (TaskSchedule[t] === undefined && !periodicTask[ps].isServer) {
          //자신의 색깔값을 스케쥴링 결과배열에 채움.
          TaskSchedule[t] = periodicTask[ps].color;
          jobPerPeriod = jobPerPeriod - 1;
          if (jobPerPeriod == 0) break;
        }
      }
    }
  }

  console.log("After DefferableScheduling: ", TaskSchedule);
  console.log("Defferable TotalWaitingTime: ", WaitingTime);
  return WaitingTime;
}
