/**
 *
 * @param {*} periodicTask 주기적 Task배열. 주기, 수행시간, pid, 컬러값을 가지는 객체배열.
 * @param {*} numAperiodicTask 숫자값
 * @detail periodicTask배열에 Server의 {주기,수행시간}객체를 추가하고, 이에 맞는 비주기적 Task배열을 랜덤하게 생성
 * @return periodicTask의 원소들에 따라 랜덤하게 결정된 비주기적 Task의 배열
 */
function calc_AperiodicTask(periodicTask, numAperiodicTask) {
  //Server를 하나의 주기로 넣어서 계산
  var totalLength = periodicTask.length + 1;
  var sigma = totalLength * (Math.pow(2, 1 / totalLength) - 1);

  var u = 0;
  for (var i in periodicTask)
    u = u + periodicTask[i].burstTime / periodicTask[i].period;

  // Rate Monotonic Scheduling 공식에 따라 범위 구하기. 가능한 최대의 비율로 Server의 주기를 결정
  var MaxRate = sigma - u;
  var ServerPeriod = 5;
  var ServerBandWidth = 2;
  for (ServerPeriod = 5; ServerPeriod++; ) {
    if (ServerBandWidth / ServerPeriod < MaxRate) break;
  }

  // Server의 수행을 하나의 주기로 보고 주기적 Task 배열에 추가
  // 기존 객체(주기, 수행시간, pid, 컬러값)에 서버의 실행임을 알 수 있는 isServer를 추가
  periodicTask.push({
    period: ServerPeriod,
    burstTime: ServerBandWidth,
    isServer: true,
    pid: "Server",
    color: "#000000"
  });

  /* 
    Server가 HyperPeriod 내에서 실행되는 횟수를 통해 최대로 처리할 수 있는 양 계산.
    이를 토대로 비주기적 Task가 Hyperperiod 내에 모두 끝나도록 각 비주기적 Task의 계산시간의 최대값, 도착시기의 최대값을 산정
    계산한 최대값까지의 랜덤값으로 도착시간, 수행시기 생성.
  */
  var HyperPeriod = calc_HyperPeriod(periodicTask);
  var MaxBurstTimePerTask = Math.floor(
    Math.floor(HyperPeriod / ServerPeriod) / numAperiodicTask
  );
  var AperiodicTask = new Array();

  // 도착시간, 수행시간, 마지막수행시간(나중에 WaitingTime계산하기 편하게 만듦)
  for (var i = 0; i < numAperiodicTask; i++) {
    var Arrival = Math.floor(Math.random() * Math.floor(HyperPeriod / 2));
    var burst = Math.floor(Math.random() * MaxBurstTimePerTask) + 1;
    AperiodicTask.push({
      ArrivalTime: Arrival,
      burstTime: burst,
      LastTaskTime: Arrival,
      pid: "AP" + i
    });
  }

  //도착순서 오름차순 정렬
  AperiodicTask.sort(function(a, b) {
    return a.ArrivalTime < b.ArrivalTime
      ? -1
      : a.ArrivalTime > b.ArrivalTime
      ? 1
      : 0;
  });

  return AperiodicTask;
}

/**
 *
 * @param {*} periodicTask 배열
 * @return  HyperPeriod.모든 주기의 최소공배수값.
 */
function calc_HyperPeriod(periodicTask) {
  var HyperPeriod = periodicTask[0].period;
  for (var i in periodicTask)
    HyperPeriod = lcm_two_numbers(HyperPeriod, periodicTask[i].period);

  return HyperPeriod;
}
/**
 *
 * @param {*} periodicTask 주기적 Task 배열
 * @returns
 */

/**
 *
 * @param {*} x 숫자
 * @param {*} y 숫자
 * @returns 두 수의 최소 공배수
 */
function lcm_two_numbers(x, y) {
  if (typeof x !== "number" || typeof y !== "number") return false;
  return !x || !y ? 0 : Math.abs((x * y) / gcd_two_numbers(x, y));
}

/**
 *
 * @param {*} x 숫자
 * @param {*} y 숫자
 * @returns 두 수의 최대 공약수
 */
function gcd_two_numbers(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}
