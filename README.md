# OS_real-time-scehduling
Aperiodic Task real time Scheduling

> Rate-Monotonic Scehduling 알고리즘을 만족하면서 Aperiodic Task의 WaitingTime을 최소화

![Alt Text](https://github.com/khujay15/OS_real-time-scehduling/blob/master/Rate.svg)

Server의 Period과 Bandwidth, Periodic Task, Aperiod Task Arrival Time 모두 랜덤.


##Polling Server

> 일정한 Period 마다 도착하는 Aperiodic Task를 Bandwidth만큼 수행.


###Deferrable Server

> Period 이내 도착하는 Aperiodic Task를 곧바로 실행. 
 
![Alt Text](https://github.com/khujay15/OS_real-time-scehduling/blob/master/Scheduling.png)
