import { IFactor } from "reliability-management/ReliabilityFieldData"

export const PDR_RADC_SAFactor: IFactor =
{
  key: "measure01",
  tab: "SA Factor (PDR)",
  field: [
    {
      title: "SA Factor 체크리스트",
      fieldheader: ["ITEM", "CHECK YES(Y), NO(N), NOTAPPLY (A), OR UNKNOWN (U)", "Y", "N", "A", "U"],
      fielddata: [
        {
          item: "AM.3(1)",
          question: ["Are there provisions for recovery from all computational failures? \n 모든 계산 실패를 복구하는 항목이 있는가?"],
          check: [
            {
              yes: 'PDR_SA_0',
              no: 'PDR_SA_0',
              notapply: 'PDR_SA_0',
              unknown: 'PDR_SA_0'
            }
          ]
        },
        {
          item: "AM.4(1)",
          question: ["Are there provisions for recovery from all detected hardware faults (e.g., arithmetic faults, power failure, clock interrupt)? \n 발견된 모든 하드웨어 오류 (예를 들면, 산술 결함, 전원 중지, 클럭 인터럽트)에서 복구하는 항목이 있는가?"],
          check: [
            {
              yes: 'PDR_SA_1',
              no: 'PDR_SA_1',
              notapply: 'PDR_SA_1',
              unknown: 'PDR_SA_1'
            }
          ]
        },
        {
          item: "AM.5(1)",
          question: ["Are there provisions for recovery from all I/O devise errors? \n 모든 I/O 장치 오류를 복구하는 항목이 있는가?"],
          check: [
            {
              yes: 'PDR_SA_2',
              no: 'PDR_SA_2',
              notapply: 'PDR_SA_2',
              unknown: 'PDR_SA_2'
            }
          ]
        },
        {
          item: "AM.6(1)",
          question: ["Are there provisions for recovery from all communication transmission errors? \n 모든 통신 전송 오류를 복구하는 항목이 있는가?"],
          check: [
            {
              yes: 'PDR_SA_3',
              no: 'PDR_SA_3',
              notapply: 'PDR_SA_3',
              unknown: 'PDR_SA_3'
            }
          ]
        },
        {
          item: "AM.6(2)",
          question: ["Is error checking information (e.g., check sum, parity bit) computed and transmitted with all messages? \n 모든 메시지와 함께 오류 체크 정보(예; 체크 합, 패리티 비트)를 계산하고 전송하는가?"],
          check: [
            {
              yes: 'PDR_SA_4',
              no: 'PDR_SA_4',
              notapply: 'PDR_SA_4',
              unknown: 'PDR_SA_4'
            }
          ]
        },
        {
          item: "AM.6(3)",
          question: ["Is error checking information computed and compared with all message receptions? \n 모든 메시지 수신과 함께 오류 체크 정보를 계산하고 비교하는가?"],
          check: [
            {
              yes: 'PDR_SA_5',
              no: 'PDR_SA_5',
              notapply: 'PDR_SA_5',
              unknown: 'PDR_SA_5'
            }
          ]
        },
        {
          item: "AM.6(4)",
          question: ["Are transmission retries limited for all transmissions? \n 모든 전송에 대하여 재전송 시도가 제한되는가?"],
          check: [
            {
              yes: 'PDR_SA_6',
              no: 'PDR_SA_6',
              notapply: 'PDR_SA_6',
              unknown: 'PDR_SA_6'
            }
          ]
        },
        {
          item: "AM.7(1)",
          question: ["Are there provisions for recovery from all failures to communicate with other nodes or other systems? \n 다른 노드 또는 다른 시스템과의 통신에서의 모든 오류를 복구하는 항목이 있는가?"],
          check: [
            {
              yes: 'PDR_SA_7',
              no: 'PDR_SA_7',
              notapply: 'PDR_SA_7',
              unknown: 'PDR_SA_7'
            }
          ]
        },
        {
          item: "AM.7(2)",
          question: ["Are there provisions to periodically check all adjacent nodes or interoperating systems for operational status? \n 모든 인접 모드 또는 동작 상태에 대하여 상호 동작하는 시스템을 주기적으로 체크하는 항목이 있는가?"],
          check: [
            {
              yes: 'PDR_SA_8',
              no: 'PDR_SA_8',
              notapply: 'PDR_SA_8',
              unknown: 'PDR_SA_8'
            }
          ]
        },
        {
          item: "AM.7(3)",
          question: ["Are there provisions for alternate routing of messages? \n 메시지 대체 라우팅에 대한 항목이 있는가?"],
          check: [
            {
              yes: 'PDR_SA_9',
              no: 'PDR_SA_9',
              notapply: 'PDR_SA_9',
              unknown: 'PDR_SA_9'
            }
          ]
        },
        {
          item: "RE.1(1)",
          question: ["Do communication paths exist to all remaining nodes/links in the event of a failure of one node/link? \n 하나의 노드/링크 장애 발생 시 나머지 모든 노드/링크에 통신하는 패스가 있는가?"],
          check: [
            {
              yes: 'PDR_SA_10',
              no: 'PDR_SA_10',
              notapply: 'PDR_SA_10',
              unknown: 'PDR_SA_10'
            }
          ]
        },
        {
          item: "RE.1(2)",
          question: ["Is the integrity of all data values maintained following the occurrence of anomalous conditions? \n 비정상적 조건이 발생함에 따라서 모든 데이터 값의 무결성이 유지되는가?"],
          check: [
            {
              yes: 'PDR_SA_11',
              no: 'PDR_SA_11',
              notapply: 'PDR_SA_11',
              unknown: 'PDR_SA_11'
            }
          ]
        },
        {
          item: "RE.1(3)",
          question: ["Can all disconnected nodes rejoin the network after recovery, such that the processing functions of the system are not interrupted? \n 시스템의 처리 함수가 중단되지 않도록, 복구 후에 모든 단절된 노드가 네트워크에 다시 결합할 수 있는가?"],
          check: [
            {
              yes: 'PDR_SA_12',
              no: 'PDR_SA_12',
              notapply: 'PDR_SA_12',
              unknown: 'PDR_SA_12'
            }
          ]
        },
        {
          item: "RE.1(4)",
          question: ["Are all critical data in the system (or CSCI) replicated at two or more distinct nodes, in accordance with specified requirements? \n 정의된 요구 사항에 따라서 시스템(또는 CSCI)의 모든 중요한 데이터가 두 개 이상의 서로 다른 노드에 복제되는가?"],
          check: [
            {
              yes: 'PDR_SA_13',
              no: 'PDR_SA_13',
              notapply: 'PDR_SA_13',
              unknown: 'PDR_SA_13'
            }
          ]
        }
      ]
    }
  ]
}

export const PDR_RADC_SQFactor: IFactor =
{
  key: "measure02",
  tab: "SQ Factor (PDR)",
  field: [
    {
      title: "SQ Factor 체크리스트",
      fieldheader: ["ITEM", "CHECK YES(Y), NO(N), NOTAPPLY (A), OR UNKNOWN (U)", "Y", "N", "A", "U"],
      fielddata: [
        {
          item: "AC.1(7)",
          question: ["Do the numerical techniques used in implementing applicable functions (e.g., mission-critical functions) provide enough precision to support accuracy objectives? \n 사용하는 함수(예를 들어, 매우 중요한 함수들)을 구현하는데 사용된 수차적 기법은 정확성 목표를 지원하기 위해 충분히 제공하는가?"],
          check: [
            {
              yes: 'PDR_SQ_0',
              no: 'PDR_SQ_0',
              notapply: 'PDR_SQ_0',
              unknown: 'PDR_SQ_0'
            }
          ]
        },
        {
          item: "AU.1(1)",
          question: ["Are all processes and functions partitioned to be logically complete and self-contained so as to minimize interface complexity? \n 인터페이스의 복잡성을 최소화할 수 있도록 모든 프로세스와 함수는 논리적으로 완전하고 독립적으로 분할되었는가?"],
          check: [
            {
              yes: 'PDR_SQ_1',
              no: 'PDR_SQ_1',
              notapply: 'PDR_SQ_1',
              unknown: 'PDR_SQ_1'
            }
          ]
        },
        {
          item: "AU.1(4)",
          question: ["a. How much estimated process time is typically spent executing the entire CSCI? \n a. 전체 CSCI를 실행하는데 전형적으로 소요되는 예상 처리 시간은 얼마인가?", "b. How much estimated processing time is typically spent in execution of hardware and device interface protocol? \n b. 하드웨어와 장치 인터페이스 프로토콜을 실행하는데 전형적으로 소요되는 예상 처리 시간은 얼마인가?", "c. Calculate R = b/(b+a); if R > .3, check N, if R < .3, cheek Y. \n c. R = b/(b+a)를 계산하고, 만약 R 이 0.3 보다 크면, N을 체크하고, R 이 0.3 보다 같거나 작으면 Y를 체크하라."],
          check: [
            {
              input: 'PDR_SQ_2',
              calcul: 'B/(B+A)>0.3'
            },

            {
              input: 'PDR_SQ_3',
              calcul: 'B/(B+A)>0.3'
            },

            {
              yes: 'PDR_SQ_4',
              no: 'PDR_SQ_4',
              notapply: 'PDR_SQ_4',
              unknown: 'PDR_SQ_4'
            }
          ]
        },
        {
          item: "AU.2(2)",
          question: ["Does the execution software perform testing of its own operation and of the communication links, memory devices, and peripheral devices? \n 실행 소프트웨어에 대하여 자신의 동작과 통신 링크, 메모리 장치 및 주변 장치에 대한 테스트를 수행하는가?"],
          check: [
            {
              yes: 'PDR_SQ_5',
              no: 'PDR_SQ_5',
              notapply: 'PDR_SQ_5',
              unknown: 'PDR_SQ_5'
            }
          ]
        },
        {
          item: "CP.1(1)",
          question: ["Are all inputs, processing, and outputs clearly and precisely defined? \n 모든 입력, 처리, 출력이 명확하고 정확하게 정의되었는가?"],
          check: [
            {
              yes: 'PDR_SQ_6',
              no: 'PDR_SQ_6',
              notapply: 'PDR_SQ_6',
              unknown: 'PDR_SQ_6'
            }
          ]
        },
        {
          item: "CP.1(2)",
          question: ["a. How many data references are defined? \n a. 정의된 데이터 참조는 몇 개인가?", "b. How many identified data references are documented with regard to source, meaning, and format? \n b. 소스, 의미, 형식 관점으로 문서화된 식별된 데이터 참조가 몇 개인가?", "c. Calculate b/a, if b/a <= 0.5, check N, if b/a > 0.5, check Y. \n c. b/a를 계산하고, 만약 b/a 가 0.5 보다 같거나 작으면, N을 체크하고, b/a 가 0.5 보다 크면 Y를 체크하라."],
          check: [

            {
              input: 'PDR_SQ_7',
              calcul: 'B/A<=0.5'
            },

            {
              input: 'PDR_SQ_8',
              calcul: 'B/A<=0.5'
            },

            {
              yes: 'PDR_SQ_9',
              no: 'PDR_SQ_9',
              notapply: 'PDR_SQ_9',
              unknown: 'PDR_SQ_9'
            }
          ]
        },
        {
          item: "CP.1(3)",
          question: ["a. How many data items are defined (i.e., documented with regard to source, meaning, and format?) \n a. 정의된 (즉, 소스, 의미, 형식 관점으로 문서화된) 데이터 항목은 몇 개인가?", "b. How many data items are referenced? \n b. 참조된 데이터 항목은 몇 개인가?", "c. Calculate b/a, if b/a <= 0.5, check N, if b/a > 0.5, cheek Y. \n c. b/a를 계산하고, 만약 b/a 가 0.5 보다 같거나 작으면, N을 체크하고, b/a 가 0.5 보다 크면 Y를 체크하라."],
          check: [

            {
              input: 'PDR_SQ_10',
              calcul: 'B/A<=0.5'
            },

            {
              input: 'PDR_SQ_11',
              calcul: 'B/A<=0.5'
            },

            {
              yes: 'PDR_SQ_12',
              no: 'PDR_SQ_12',
              notapply: 'PDR_SQ_12',
              unknown: 'PDR_SQ_12'
            }
          ]
        },
        {
          item: "CP.1(4)",
          question: ["a. How many data references are identified? \n a. 식별된 데이터 참조는 몇 개인가?", "b. How many identified data references are computed or obtained from an external source (e.g., referencing global data with preassigned values, input parameters with preassigned values)? \n b. 외부 소스로부터 계산되거나 얻어지는 (예를 들어, 미리 지정된 값이 있는 전역 데이터, 미리 지정된 값이 있는 입력 파라미터 참조 등) 식별된 데이터 참조는 몇 개인가?", "c. Calculate b/a, if b/a <= 0.5, check N, otherwise, check Y. \n c. b/a를 계산하고, 만약 b/a 가 0.5 보다 같거나 작으면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'PDR_SQ_13',
              calcul: 'B/A<=0.5'
            },

            {
              input: 'PDR_SQ_14',
              calcul: 'B/A<=0.5'
            },

            {
              yes: 'PDR_SQ_15',
              no: 'PDR_SQ_15',
              notapply: 'PDR_SQ_15',
              unknown: 'PDR_SQ_15'
            }
          ]
        },
        {
          item: "CP.1(6)",
          question: ["Have all functions for this CSCI been allocated to top-level CSCs of this CSCI? \n CSCI에 대한 모든 함수는 CSCI의 상위 수준의 CSC에 할당되었는가"],
          check: [
            {
              yes: 'PDR_SQ_16',
              no: 'PDR_SQ_16',
              notapply: 'PDR_SQ_16',
              unknown: 'PDR_SQ_16'
            }
          ]
        },
        {
          item: "CP.1(9)",
          question: ["Are all conditions and alternative processing options defined for each decision point? \n 모든 조건과 대체 처리 옵션은 각각의 결정 항목에 대하여 정의되었는가?"],
          check: [
            {
              yes: 'PDR_SQ_17',
              no: 'PDR_SQ_17',
              notapply: 'PDR_SQ_17',
              unknown: 'PDR_SQ_17'
            }
          ]
        },
        {
          item: "CP.1(11)",
          question: ["a. How many software discrepancy reports have been recorded, to date? \n a. 현재까지, 소프트웨어 불일치 보고는 몇 개나 기록되었는가?", "b. How many recorded software problem reports have been closed (resolved), to date? \n b. 현재까지, 기록된 소프트웨어 문제 보고는 몇 개나 완료(해결)되었는가?", "c. Calculate b/a, if b/a <= 0.75, check N, otherwise, check Y. \n c. b/a를 계산하고, 만약 b/a 가 0.75 보다 같거나 작으면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'PDR_SQ_18',
              calcul: 'B/A<=0.75'
            },

            {
              input: 'PDR_SQ_19',
              calcul: 'B/A<=0.75'
            },

            {
              yes: 'PDR_SQ_20',
              no: 'PDR_SQ_20',
              notapply: 'PDR_SQ_20',
              unknown: 'PDR_SQ_20'
            }
          ]
        },
        {
          item: "CS.1(1)",
          question: ["Are all design representations in the formats of the established standard? \n 모든 설계 표현이 수립된 표준의 형식에 있는가?"],
          check: [
            {
              yes: 'PDR_SQ_21',
              no: 'PDR_SQ_21',
              notapply: 'PDR_SQ_21',
              unknown: 'PDR_SQ_21'
            }
          ]
        },
        {
          item: "CS.1(5)",
          question: ["Do all references to the same top-level CSC use a single, unique name? \n 동일한 상위 수준의 CSC에서 모든 참조는 하나의 고유한 이름을 사용하는가?"],
          check: [
            {
              yes: 'PDR_SQ_22',
              no: 'PDR_SQ_22',
              notapply: 'PDR_SQ_22',
              unknown: 'PDR_SQ_22'
            }
          ]
        },
        {
          item: "CS.2(1)",
          question: ["Does all data representation comply with the established standard? \n 모든 데이터 표현이 수립된 표준에 적합한가?"],
          check: [
            {
              yes: 'PDR_SQ_23',
              no: 'PDR_SQ_23',
              notapply: 'PDR_SQ_23',
              unknown: 'PDR_SQ_23'
            }
          ]
        },
        {
          item: "CS.2(2)",
          question: ["Does the naming of all data comply with the established standard? \n 모든 데이터 명명은 수립된 표준에 적합한가?"],
          check: [
            {
              yes: 'PDR_SQ_24',
              no: 'PDR_SQ_24',
              notapply: 'PDR_SQ_24',
              unknown: 'PDR_SQ_24'
            }
          ]
        },
        {
          item: "CS.2(3)",
          question: ["Is the definition and use of all global variables in accordance with the established standard? \n 모든 전역 변수의 정의 및 사용은 수립된 표준에 따르는가?"],
          check: [
            {
              yes: 'PDR_SQ_25',
              no: 'PDR_SQ_25',
              notapply: 'PDR_SQ_25',
              unknown: 'PDR_SQ_25'
            }
          ]
        },
        {
          item: "CS.2(4)",
          question: ["Are there procedures for establishing consistency and concurrency of multiple copies (e.g., copies at different nodes) of the same software or data base version? \n 동일한 소프트웨어 또는 데이터베이스 버전의 여러 복사본((예를 들어, 서로 다른 노드에 복사본)의 일관성과 동시성을 설정하기 위한 절차가 있는가?"],
          check: [
            {
              yes: 'PDR_SQ_26',
              no: 'PDR_SQ_26',
              notapply: 'PDR_SQ_26',
              unknown: 'PDR_SQ_26'
            }
          ]
        },
        {
          item: "CS.2(5)",
          question: ["Are there procedures for verifying consistency and concurrency of multiple copies (e.g., copies at different nodes) of the same software or data base version? \n 동일한 소프트웨어 또는 데이터베이스 버전의 여러 복사본((예를 들어, 서로 다른 노드에 복사본)의 일관성과 동시성을 검증하기 위한 절차가 있는가?"],
          check: [
            {
              yes: 'PDR_SQ_27',
              no: 'PDR_SQ_27',
              notapply: 'PDR_SQ_27',
              unknown: 'PDR_SQ_27'
            }
          ]
        },
        {
          item: "CS.2(6)",
          question: ["Do all references to the same data use a single, unique name? \n 동일한 데이터에 대한 모든 참조는 하나의 고유한 이름을 사용하는가?"],
          check: [
            {
              yes: 'PDR_SQ_28',
              no: 'PDR_SQ_28',
              notapply: 'PDR_SQ_28',
              unknown: 'PDR_SQ_28'
            }
          ]
        }
      ]
    }
  ]
}

export const PDR_RADC_STFactor: IFactor =
{
  key: "measure03",
  tab: "ST Factor (PDR)",
  field: [
    {
      title: "ST Factor (추적성)",
      fieldheader: ["체크리스트", "YES", "NO"],
      fielddata: [
        {
          question: ["1. Is there a table(s) tracting all the top-level CSC allocated requirements to the parent CSCI specification? \n Top-level CSC의 요구사항들이 상위 CSCI 명세서로 추적할 수 있는 테이블이 존재하는가?"],
          check: [
            {
              yes: 'PDR_ST_0',
              no: 'PDR_ST_0'
            }
          ]
        }
      ]
    }
  ]
}


export const PDR_RADC_MODAL_FIELD = [PDR_RADC_SAFactor, PDR_RADC_SQFactor, PDR_RADC_STFactor]