import { IFactor } from "reliability-management/ReliabilityFieldData"

export const SRR_RADC_AFactor: IFactor = // system, val, check { name, value} 
{
  key: 'measure01',
  tab: 'A Factor (SRR)',
  field: [
    {
      title: "A Factor (시스템 유형) : 항목선택",
      fieldheader: ["시스템 유형", "값", "Check"],
      fielddata: [
        {
          item: "Airborne (항공)",
          question: ["0.0128"],
          check: [
            {
              name: 'SRR_A_1',
              value: 'Airborne'
            }
          ]
        },
        {
          item: "Strategic (전략)",
          question: ["0.0092"],
          check: [
            {
              name: 'SRR_A_1',
              value: 'Strategic'
            }
          ]
        },
        {
          item: "Tactical (전술)",
          question: ["0.0078"],
          check: [
            {
              name: 'SRR_A_1',
              value: 'Tactical'
            }
          ]
        },
        {
          item: "Process_Control (교전관리)",
          question: ["0.0018"],
          check: [
            {
              name: 'SRR_A_1',
              value: 'Process_Control'
            }
          ]
        },
        {
          item: "Production (생산)",
          question: ["0.0085"],
          check: [
            {
              name: 'SRR_A_1',
              value: 'Production'
            }
          ]
        },
        {
          item: "Developmental (개발)",
          question: ["0.0123"],
          check: [
            {
              name: 'SRR_A_1',
              value: 'Developmental'
            }
          ]
        }
      ]
    }
  ]


}


export const SRR_RADC_DFactor: IFactor = // item, feature, check { name, value} / dev, feature, value, check { name, value} / question, yes, no
{
  key: 'measure02',
  tab: "D Factor (SRR)",
  field: [
    {
      title: "D Factor (개발 환경) : 항목선택 / 체크리스트",
      fieldheader: ["D Factor", "특징", "Check"],
      fielddata: [
        {
          item: "D(1)",
          question: ["Basic information for development environments. \n 현재 개발 조직에 대한 제한된 정보만 존재하는 경우"],
          check: [{
            name: 'SRR_D_category',
            value: "D1"
          }]
        },
        {
          item: "D(2)",
          question: ["More specific data about the environmen (this modified approach is based on specific organizational/personnel considerations, methods used, documentation to be produced, and tools to be used.) \n 시스템 환경에 대한 체크리스트를 기반으로 세분화된 정보를 가지고 있는 경우"],
          check: [{
            name: 'SRR_D_category',
            value: "D2"
          }]
        }
      ]
    },
    {
      title: "개발 환경 선택",
      fieldheader: ["개발 환경", "특징", "값", "Check"],
      fielddata: [
        {
          item: "Organic",
          question: ["The software team is part of the organization served by the program. \n 소프트웨어 개발 조직이 자신의 조직에서 사용 및 운영될 소프트웨어를 개발하는 경우"],
          result: "0.76",
          check: [{
            name: 'SRR_D_feature',
            value: 'Organic'
          }]
        },
        {
          item: "Semi_Detached",
          question: ["The software team is experienced in the application but not affiliated with user. \n •소프트웨어 개발 조직이 개발할 소프트웨어에 대한 경험과 지식을 가지고 있으나, 개발된 소프트웨어를 실제 사용 및 운영하지 않는 경우 \n • 가장 일반적인 형태"],
          result: "1",
          check: [{
            name: 'SRR_D_feature',
            value: 'Semi_Detached'
          }]
        },
        {
          item: "Embedded",
          question: ["Personnel operate within tight constraints. \n •매우 제한된 제약 조건 아래에서 특정 경험과 지식을 가진 소프트웨어 개발 조직으로 개발되는 경우 The software team has much computer expertise, but may be unfamiliar with the application served by the program. \n • 특성과 같이 개발된 소프트웨어를 실제 사용 및 운영하지 않는 경우 System operates within strongly coupled compled of hardeware, software regulations, and operational procedures. \n • 제약조건의 예는 하드웨어, 소프트웨어, 그리고 운영절차가 매우 밀접하게 연관된 복잡한 시스템을 구성하는 소프트웨어의 개발과 같은 경우"],
          result: "1.3",
          check: [{
            name: 'SRR_D_feature',
            value: 'Embedded'
          }]
        }
      ]
    },
    {
      title: "D(2) 선택 - 체크리스트 항목",
      fieldheader: ["A. Organizational Considerations(8): 현재 조직의 특성", "YES(1)", "NO(0)"],
      fielddata: [
        {
          question: ["A1. Separate design and coding \n 설계와 구현단계가 구분되었는가?"],
          check: [{
            yes: "SRR_D_0",
            no: 'SRR_D_0'
          }]
        },
        {
          question: ["A2. Independent test organization \n 독립적인 테스트 조직을 가지고 있는가?"],
          check: [{
            yes: "SRR_D_1",
            no: 'SRR_D_1'
          }]
        },
        {
          question: ["A3. Independent quality assurance \n 독립적인 품질 보증 조직을 가지고 있는가?"],
          check: [{
            yes: "SRR_D_2",
            no: 'SRR_D_2'
          }]
        },
        {
          question: ["A4. Independent configuration management \n 형상관리가 이루어지는가?"],
          check: [{
            yes: "SRR_D_3",
            no: 'SRR_D_3'
          }]
        },
        {
          question: ["A5. Independent verification and validation \n Verification and Validation 활동이 존재하는가?"],
          check: [{
            yes: "SRR_D_4",
            no: 'SRR_D_4'
          }]
        },
        {
          question: ["A6. Programming team structure \n 구현 팀이 조직화되어 있는가?"],
          check: [{
            yes: "SRR_D_5",
            no: 'SRR_D_5'
          }]
        },
        {
          question: ["A7. Educational level of team members above average \n 프로젝트 참여 멤버들의 교육수준이 조직의 평균 이상인가?"],
          check: [{
            yes: "SRR_D_6",
            no: 'SRR_D_6'
          }]
        },
        {
          question: ["A8. Experience level of team members above average \n 관련 프로젝트에 경험이 있는 사람들이 신규 참여자 보다 많은가?"],
          check: [{
            yes: 'SRR_D_7',
            no: 'SRR_D_7'
          }]
        }
      ]
    },
    {
      title: "",
      fieldheader: ["B. Methods Used(9): 시스템 개발 방법에 대한 특성", "YES(1)", "NO(0)"],
      fielddata: [
        {
          question: ["B1. Definition / Enforcement of standards \n 프로젝트 관련 표준이 정의되어 있는가?"],
          check: [{
            yes: "SRR_D_8",
            no: 'SRR_D_8'
          }]
        },
        {
          question: ["B2. Use of higher order language (HOL) \n 상위 수준 언어를 이용하는가?"],
          check: [{
            yes: 'SRR_D_9',
            no: 'SRR_D_9'
          }]
        },
        {
          question: ["B3. Formal reviews (PDR, CDR, etc.) \n Formal Review를 수행하는가?"],
          check: [{
            yes: 'SRR_D_10',
            no: 'SRR_D_10'
          }]
        },
        {
          question: ["B4. Frequent walkthroughs \n Walkthrough 활동이 빈번이 일어나는가?"],
          check: [{
            yes: 'SRR_D_11',
            no: 'SRR_D_11'
          }]
        },
        {
          question: ["B5. Top-down and structured approaches \n 프로젝트 수행이 Top-down approach인가?"],
          check: [{
            yes: 'SRR_D_12',
            no: 'SRR_D_12'
          }]
        },
        {
          question: ["B6. Unit development folders \n 단위 개발로 수행되는가 (Unit Development folders)?"],
          check: [{
            yes: 'SRR_D_13',
            no: 'SRR_D_13'
          }]
        },
        {
          question: ["B7. Software development library \n 소프트웨어 개발 library를 사용하는가?"],
          check: [{
            yes: 'SRR_D_14',
            no: 'SRR_D_14'
          }]
        },
        {
          question: ["B8. Formal change and error reporting \n Formal change and error reporting 되는가?"],
          check: [{
            yes: 'SRR_D_15',
            no: 'SRR_D_15'
          }]
        },
        {
          question: ["B9. Progress and status reporting \n 프로젝트 진척 보고 및 상황이 reporting 되는가?"],
          check: [{
            yes: 'SRR_D_16',
            no: 'SRR_D_16'
          }]
        }
      ]
    },
    {
      title: "",
      fieldheader: ["C. Documentation(12): 문서화", "YES(1)", "NO(0)"],
      fielddata: [
        {
          question: ["C1. System Requirements Specification \n 시스템 요구사항 명세서가 존재하는가?"],
          check: [{
            yes: 'SRR_D_17',
            no: 'SRR_D_17'
          }]
        },
        {
          question: ["C2. Software Requirements Specification \n 소프트웨어 요구사항 명세서가 존재하는가?"],
          check: [{
            yes: 'SRR_D_18',
            no: 'SRR_D_18'
          }]
        },
        {
          question: ["C3. Interface Design Specification \n Interface 설계 명세서가 존재하는가?"],
          check: [{
            yes: 'SRR_D_19',
            no: 'SRR_D_19'
          }]
        },
        {
          question: ["C4. Software Design Specification \n 소프트웨어 설계 명세서가 존재하는가?"],
          check: [{
            yes: 'SRR_D_20',
            no: 'SRR_D_20'
          }]
        },
        {
          question: ["C5. Test Plans, Procedures and Reports \n Test 계획, 절차, 보고에 관련 문서가 존재하는가?"],
          check: [{
            yes: 'SRR_D_21',
            no: 'SRR_D_21'
          }]
        },
        {
          question: ["C6. Software Development Plan \n 소프트웨어 개발 계획 문서가 존재하는가?"],
          check: [{
            yes: 'SRR_D_22',
            no: 'SRR_D_22'
          }]
        },
        {
          question: ["C7. Software Quality Assurance Plan \n 소프트웨어 품질 보증 계획 문서가 존재하는가?"],
          check: [{
            yes: 'SRR_D_23',
            no: 'SRR_D_23'
          }]
        },
        {
          question: ["C8. Software Configuration Management Plan \n 소프트웨어 형상 관리 계획 문서가 존재하는가?"],
          check: [{
            yes: 'SRR_D_24',
            no: 'SRR_D_24'
          }]
        },
        {
          question: ["C9. Requirements Traceability Matrix \n 요구사항 추적성을 확인하기 위한 Metric이 존재하는가?"],
          check: [{
            yes: 'SRR_D_25',
            no: 'SRR_D_25'
          }]
        },
        {
          question: ["C10. Version Description Document \n version을 설명한 문서가 존재하는가?"],
          check: [{
            yes: 'SRR_D_26',
            no: 'SRR_D_26'
          }]
        },
        {
          question: ["C11. Software Discrepancy Reports \n Software Discrepancy 문서가 존재하는가?"],
          check: [{
            yes: 'SRR_D_27',
            no: 'SRR_D_27'
          }]
        }
      ]
    },
    {
      title: "",
      fieldheader: ["D. Tools Used(9): 개발 지원 도구의 특성", "YES(1)", "NO(0)"],
      fielddata: [
        {
          question: ["D1. Requirements Specification Language \n 요구사항 명세를 위한 Tool을 사용하는가?"],
          check: [{
            yes: 'SRR_D_28',
            no: 'SRR_D_28'
          }]
        },
        {
          question: ["D2. Program Design Language \n 소프트웨어 설계를 위한 전문 Tool을 사용하는가?"],
          check: [{
            yes: 'SRR_D_29',
            no: 'SRR_D_29'
          }]
        },
        {
          question: ["D3. Program Design Graphical Technique(flowchart, EIPO, etc.) \n 소프트웨어 설계를 위한 도표화 기술을 사용하는가? (ex, Flowchart, vision 등)"],
          check: [{
            yes: 'SRR_D_30',
            no: 'SRR_D_30'
          }]
        },
        {
          question: ["D4. Simulation / Emulation \n Simulation/Emulation Tool을사용하는가?"],
          check: [{
            yes: 'SRR_D_31',
            no: 'SRR_D_31'
          }]
        },
        {
          question: ["D5. Configuration Management \n 형상관리 Tool을 사용하는가?"],
          check: [{
            yes: 'SRR_D_32',
            no: 'SRR_D_32'
          }]
        },
        {
          question: ["D6. Code auditor \n Code Auditor을 사용하는가?"],
          check: [{
            yes: 'SRR_D_33',
            no: 'SRR_D_33'
          }]
        },
        {
          question: ["D7. Data Flow Analyzer \n Data Flow Analyzer을 사용하는가?"],
          check: [{
            yes: 'SRR_D_34',
            no: 'SRR_D_34'
          }]
        },
        {
          question: ["D8. Programmer Workbench \n Programmer Workbench을 사용하는가?"],
          check: [{
            yes: 'SRR_D_35',
            no: 'SRR_D_35'
          }]
        },
        {
          question: ["D9. Measurement Tools \n 측정(Measurement)을 위한 Tool을 사용하는가?"],
          check: [{
            yes: 'SRR_D_36',
            no: 'SRR_D_36'
          }]
        }
      ]
    },
    {
      title: "",
      fieldheader: ["E. Test Techniques Planned(6): 테스트 기술에 대한 특성", "YES(1)", "NO(0)"],
      fielddata: [
        {
          question: ["E1. Code Review \n Code Review를 수행하는가?"],
          check: [{
            yes: 'SRR_D_37',
            no: 'SRR_D_37'
          }]
        },
        {
          question: ["E2. Branch Testing \n Branch Testing을 수행하는가? (White Box 테스트)"],
          check: [{
            yes: 'SRR_D_38',
            no: 'SRR_D_38'
          }]
        },
        {
          question: ["E3. Random Testing \n Random Testing을 수행하는가?"],
          check: [{
            yes: 'SRR_D_39',
            no: 'SRR_D_39'
          }]
        },
        {
          question: ["E4. Functional Testing \n Functional Testing을 수행하는가?"],
          check: [{
            yes: 'SRR_D_40',
            no: 'SRR_D_40'
          }]
        },
        {
          question: ["E5. Error & Anomaly Detection \n Error & Anomaly Detection을 수행하는가?"],
          check: [{
            yes: 'SRR_D_41',
            no: 'SRR_D_41'
          }]
        },
        {
          question: ["E6. Structure Analysis \n Structure Analysis을수행하는가?"],
          check: [{
            yes: 'SRR_D_42',
            no: 'SRR_D_42'
          }]
        }
      ]
    }
  ]
}


export const SRR_RADC_SAFactor: IFactor = // item, question, check { input, calcul} / item, question, check { yes, no, notapply, unknown}
{
  key: "measure03",
  tab: "SA Factor (SRR)",
  field: [
    {
      title: "SA Factor 체크리스트",
      fieldheader: ["ITEM", "CHECK YES(Y), NO(N), NOTAPPLY (A), OR UNKNOWN (U)", "Y", "N", "A", "U"],
      fielddata: [
        {
          item: "AM.1(1)",
          question: ["a. How many instances are there of different processes (or functions, subfunctions) which are required to be executed at the same time (i.e.., concurrent processing)? \n a. 동시에 수행되는 다른 프로세스(또는 함수, 서브함수)의 인스턴스는 몇 개인가?", "b. How many instances of concurrent processing are required to be centrally controlled? \n b. 중앙에서 제어될 동시에 수행되는 프로세스의 인스턴스는 몇 개인가?", "c. Calculate b/a, if b/a < 1, check N, if b/a = 1, check Y. \n c. b/a를 계산하고, 만약 b/a 가 1 보다 작으면, N을 체크하고, b/a 가 1 이면 Y를 체크하라. \n\n ※ b가 a보다 큰 값은 UNKNOWN 처리됩니다. ※"],
          check: [
            {
              input: 'SRR_SA_0',
              calcul: 'B/A<1'
            },
            {
              input: 'SRR_SA_1',
              calcul: 'B/A<1'
            },
            {
              yes: 'SRR_SA_2',
              no: 'SRR_SA_2',
              notapply: 'SRR_SA_2',
              unknown: 'SRR_SA_2'
            }
          ]
        },
        {
          item: "AM.1(2)",
          question: ["a. How many error conditions are required to be recognized (identified)? \n a. 인식된(식별된) 에러조건은몇개인가?", "b. How many recognized error conditions require recover or repair? \n b. 복구 또는 수리를 요구하는 인식된 에러 조건은 몇 개인가?", "c. Calculate b/a, if b/a < 1, check N, if b/a = 1, check Y. \n c. b/a를 계산하고, 만약 b/a 가 1 보다 작으면, N을 체크하고, b/a 가 1 이면 Y를 체크하라. \n\n ※ b가 a보다 큰 값은 UNKNOWN 처리됩니다. ※"],
          check: [
            {
              input: 'SRR_SA_3',
              calcul: 'B/A<1'
            },

            {
              input: 'SRR_SA_4',
              calcul: 'B/A<1'
            },

            {
              yes: 'SRR_SA_5',
              no: 'SRR_SA_5',
              notapply: 'SRR_SA_5',
              unknown: 'SRR_SA_5'
            }
          ]
        },
        {
          item: "AM.1(3)",
          question: ["Is there a standard for handling recognized errors such that all error conditions are passed to the calling function or software element? \n 호출하는 함수 또는 소프트웨어 구성요소에서 통과하는 모든 에러 조건과 같은 인식된 에러를 처리하는 표준이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_6',
              no: 'SRR_SA_6',
              notapply: 'SRR_SA_6',
              unknown: 'SRR_SA_6'
            }
          ]
        },
        {
          item: "AM.1(4)",
          question: ["a. How many instances exist of the same process (or function, subfunction) being required to execute more than once for comparison purposes (i.e., polling of parallel or redundant processing results)? \n a. 비교 (즉, 병렬식 폴링 또는 중복적인 처리 결과)를 위해서 한 번 이상 실행되는 동일한 프로세스 (또는 함수, 서브함수)의 인스턴스는 몇 개인가?", "b. How many instances of parallel/redundant processing are required to be centrally controlled? \n b. 중앙에서 제어될 병렬식/중복적인 처리의 인스턴스는 몇 개인가?", "c. Calculate b/a, if b/a < 1, check N, if b/a = 1, check Y. \n c. b/a를 계산하고, 만약 b/a 가 1 보다 작으면, N을 체크하고, b/a 가 1 이면 Y를 체크하라. \n\n ※ b가 a보다 큰 값은 UNKNOWN 처리됩니다. ※"],
          check: [
            {
              input: 'SRR_SA_7',
              calcul: 'B/A<1'
            },
            {
              input: 'SRR_SA_8',
              calcul: 'B/A<1'
            },
            {
              yes: 'SRR_SA_9',
              no: 'SRR_SA_9',
              notapply: 'SRR_SA_9',
              unknown: 'SRR_SA_9'
            }
          ]
        },
        {
          item: "AM.2(1)",
          question: ["Are error tolerances specified for all applicable external input data (i.e., range of numerical values, legal combinations of alphanumerical values)? \n 모든 적용 가능한 외부 입력 데이터(즉, 숫자 값의 범위, 문자 숫자 값의 규칙적 조합)에 대해 정해진 오류 허용 오차가 있는가?"],
          check: [
            {
              yes: 'SRR_SA_10',
              no: 'SRR_SA_10',
              notapply: 'SRR_SA_10',
              unknown: 'SRR_SA_10'
            }
          ]
        },
        {
          item: "AM.3(1)",
          question: ["Are there requirements for detection of an (or recovery from all) computational failure(s)? \n 계산 실패 발견(또는 복구)에 대한 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_11',
              no: 'SRR_SA_11',
              notapply: 'SRR_SA_11',
              unknown: 'SRR_SA_11'
            }
          ]
        },
        {
          item: "AM.3(2)",
          question: ["Are there requirements to range test all critical (i.e., supporting a mission-critical function) loop and multiple transfer index parameters before use? \n 사용 전에 모든 중요한 루프 및 다중 전송 인덱스 파라미터를 테스트 범위로 하는 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_12',
              no: 'SRR_SA_12',
              notapply: 'SRR_SA_12',
              unknown: 'SRR_SA_12'
            }
          ]
        },
        {
          item: "AM.3(3)",
          question: ["Are there requirements to range test all critical (i.e., supporting a mission-critical function) subscript values before use? \n 사용하기 전에 모든 중요한 (즉, 중요 기능을 담당하는 함수) 첨자 값을 테스트 범위로 하는 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_13',
              no: 'SRR_SA_13',
              notapply: 'SRR_SA_13',
              unknown: 'SRR_SA_13'
            }
          ]
        },
        {
          item: "AM.3(4)",
          question: ["Are there requirements to range test all critical output data (i.e., data supporting a mission-critical system function) before final outputting? \n 최종 출력하기 전에 모든 중요한 출력 데이터(즉, 중요 기능의 시스템 함수를 지원하는 데이터)을 테스트 범위로 하는 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_14',
              no: 'SRR_SA_14',
              notapply: 'SRR_SA_14',
              unknown: 'SRR_SA_14'
            }
          ]
        },
        {
          item: "AM.4(1)",
          question: ["Are there requirements for recovery from all detected hardware faults (i.e., arithmetic faults, power failure, clock interrupt)? \n 발견된 모든 하드웨어 결함(즉, 산술 결함, 전원 중지, 클럭 인터럽트)을 복구하는 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_15',
              no: 'SRR_SA_15',
              notapply: 'SRR_SA_15',
              unknown: 'SRR_SA_15'
            }
          ]
        },
        {
          item: "AM.5(1)",
          question: ["Are there requirements for recovery from all I/O divide errors? \n 모든 I/O 장치 오류를 복구하는 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_16',
              no: 'SRR_SA_16',
              notapply: 'SRR_SA_16',
              unknown: 'SRR_SA_16'
            }
          ]
        },
        {
          item: "AM.6(1)",
          question: ["Are there requirements for recovery from all communication transmission errors? \n 모든 통신전송 오류를 복구하는 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_17',
              no: 'SRR_SA_17',
              notapply: 'SRR_SA_17',
              unknown: 'SRR_SA_17'
            }
          ]
        },
        {
          item: "AM.7(1)",
          question: ["Are there requirements for recovery from all failures to communicate with other modes or other systems? \n 다른 모드 또는 다른 시스템과의 모든 통신 오류를 복구하는 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_18',
              no: 'SRR_SA_18',
              notapply: 'SRR_SA_18',
              unknown: 'SRR_SA_18'
            }
          ]
        },
        {
          item: "AM.7(2)",
          question: ["Are there requirements to periodically check adjacent nodes or interoperating system for operational status? \n 인접 모드 또는 동작 상태에 대하여 상호 동작하는 시스템을 주기적으로 체크하는 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_19',
              no: 'SRR_SA_19',
              notapply: 'SRR_SA_19',
              unknown: 'SRR_SA_19'
            }
          ]
        },
        {
          item: "AM.7(3)",
          question: ["Are there requirements to provide a strategy for alternate routing of messages \n 메시지에 대하여 대체 라우팅하는 전략을 제공하는 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_20',
              no: 'SRR_SA_20',
              notapply: 'SRR_SA_20',
              unknown: 'SRR_SA_20'
            }
          ]
        },
        {
          item: "RE.1(1)",
          question: ["Are there requirements to ensure communication paths to all remaining nodes/ communication links in the event of a failure of one node/link? \n 하나의 노드 / 링크의 장애 시 나머지 모든 노드 / 통신 링크에 대한 통신 경로를 보장하기 위한 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_21',
              no: 'SRR_SA_21',
              notapply: 'SRR_SA_21',
              unknown: 'SRR_SA_21'
            }
          ]
        },
        {
          item: "RE.1(2)",
          question: ["Are there requirements for maintaining the integrity of all data values following the occurrence of anomalous conditions? \n 비정상적인 조건의 발생에 따라 모든 데이터 값의 무결성을 유지하기 위한 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_22',
              no: 'SRR_SA_22',
              notapply: 'SRR_SA_22',
              unknown: 'SRR_SA_22'
            }
          ]
        },
        {
          item: "RE.1(3)",
          question: ["Are there requirements to enable all disconnected nodes to rejoin the network after recovery, such that the processing functions of the system are not interrupted? \n 시스템의 처리 함수가 중단되지 않는 등의 복구 후에 모든 단절된 노드를 네트워크에 재결합하도록 하는 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_23',
              no: 'SRR_SA_23',
              notapply: 'SRR_SA_23',
              unknown: 'SRR_SA_23'
            }
          ]
        },
        {
          item: "RE.1(4)",
          question: ["Are there requirements to replicate all critical data in the CSCI at two or more distinct nodes? \n 두 개 이상의 서로 다른 노드에서 CSCI의 모든 중요한 데이터를 복제하는 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SA_24',
              no: 'SRR_SA_24',
              notapply: 'SRR_SA_24',
              unknown: 'SRR_SA_24'
            }
          ]
        }
      ]
    }
  ]
}

export const SRR_RADC_SQFactor: IFactor = // item, question, check { input, calcul} / item, question, check { yes, no, notapply, unknown}
{
  key: "measure04",
  tab: "SQ Factor (SRR)",
  field: [
    {
      title: "SQ Factor 체크리스트",
      fieldheader: ["ITEM", "CHECK YES(Y), NO(N), NOTAPPLY (A), OR UNKNOWN (U)", "Y", "N", "A", "U"],
      fielddata: [
        {
          item: "AC.1(3)",
          question: ["Are there quantitative accuracy requirements for all applicable inputs associated with each applicable function (e.g., mission-critical functions)? \n 각각의 해당되는 함수(예를 들어, 매우 중요한 함수)에 관련된 모든 사용되는 입력에 대하여 정량적이고 정확한 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SQ_0',
              no: 'SRR_SQ_0',
              notapply: 'SRR_SQ_0',
              unknown: 'SRR_SQ_0'
            }
          ]
        },
        {
          item: "AC.1(4)",
          question: ["Are there quantitative accuracy requirements for all applicable outputs associated with each applicable function (e.g., mission-critical functions)? \n 각각의 해당되는 함수(예를 들어, 매우 중요한 함수)에 관련된 모든 사용되는 출력에 대하여 정량적이고 정확한 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SQ_1',
              no: 'SRR_SQ_1',
              notapply: 'SRR_SQ_1',
              unknown: 'SRR_SQ_1'
            }
          ]
        },
        {
          item: "AC.1(5)",
          question: ["Are there quantitative accuracy requirements for all applicable constants associated with each applicable function (e.g., mission-critical functions)? \n 각각의 해당되는 함수(예를 들어, 매우 중요한 함수)에 관련된 모든 사용되는 상수에 대하여 정량적이고 정확한 요구사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SQ_2',
              no: 'SRR_SQ_2',
              notapply: 'SRR_SQ_2',
              unknown: 'SRR_SQ_2'
            }
          ]
        },
        {
          item: "AC.1(6)",
          question: ["Do the existing math library routines which are planned for use provide enough precision to support accuracy objectives? \n 사용하기로 계획된 기존의 수학 라이브러리 루틴은 정확성 목표를 지원하기 위해 충분한 정밀도를 제공하는가?"],
          check: [
            {
              yes: 'SRR_SQ_3',
              no: 'SRR_SQ_3',
              notapply: 'SRR_SQ_3',
              unknown: 'SRR_SQ_3'
            }
          ]
        },
        {
          item: "AU.1(1)",
          question: ["Are all processes and functions partitioned to be logically complete and self-contained so as to minimize interface complexity? \n 인터페이스의 복잡성을 최소화할 수 있도록 모든 프로세스와 함수는 논리적으로 완전하고 독립적으로 분할되었는가?"],
          check: [
            {
              yes: 'SRR_SQ_4',
              no: 'SRR_SQ_4',
              notapply: 'SRR_SQ_4',
              unknown: 'SRR_SQ_4'
            }
          ]
        },
        {
          item: "AC.2(1)",
          question: ["Are there requirements for each operational CPU/System to have a separate power source? \n 각각의 운영되는 CPU/시스템에 대하여 별도의 전원을 가지도록 하는 요구 사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SQ_5',
              no: 'SRR_SQ_5',
              notapply: 'SRR_SQ_5',
              unknown: 'SRR_SQ_5'
            }
          ]
        },
        {
          item: "AC.2(2)",
          question: ["Are there requirements for the executive software to perform testing of its own operation and of the communication links, memory devices, and peripheral devices? \n 실행 소프트웨어에 대하여 자신의 동작과 통신 링크, 메모리 장치 및 주변 장치에 대한 테스트를 수행하도록 하는 요구 사항이 있는가?"],
          check: [
            {
              yes: 'SRR_SQ_6',
              no: 'SRR_SQ_6',
              notapply: 'SRR_SQ_6',
              unknown: 'SRR_SQ_6'
            }
          ]
        },
        {
          item: "CP.1(1)",
          question: ["Are all inputs, processing, and outputs clearly and precisely defined? \n 모든 입력, 처리, 출력이 명확하고 정확하게 정의되었는가?"],
          check: [
            {
              yes: 'SRR_SQ_7',
              no: 'SRR_SQ_7',
              notapply: 'SRR_SQ_7',
              unknown: 'SRR_SQ_7'
            }
          ]
        },
        {
          item: "CP.1(2)",
          question: ["a. How many data references are identified? \n a. 식별된 데이터 참조는 몇 개인가?", "b. How many identified data references are documented with regard to source, meaning, and format? \n b. 소스, 의미, 형식 관점으로 문서화된 식별된 데이터 참조가 몇 개인가?", "c. Calculate b/a, if b/a < 1, check N, if b/a = 1, check Y. \n c. b/a를 계산하고, 만약 b/a 가 1 보다 작으면, N을 체크하고, b/a 가 1 이면 Y를 체크하라. \n\n ※ b가 a보다 큰 값은 UNKNOWN 처리됩니다. ※"],
          check: [
            {
              input: 'SRR_SQ_8',
              calcul: 'B/A<1'
            },
            {
              input: 'SRR_SQ_9',
              calcul: 'B/A<1'
            },
            {
              yes: 'SRR_SQ_10',
              no: 'SRR_SQ_10',
              notapply: 'SRR_SQ_10',
              unknown: 'SRR_SQ_10'
            }
          ]
        },
        {
          item: "CP.1(3)",
          question: ["a. How many data items are defined (i.e., documented with regard to source, meaning, and format)? \n a. 정의된 (즉, 소스, 의미, 형식 관점으로 문서화된) 데이터 항목은 몇 개인가?", "b. How many data items are referenced? \n b. 참조된 데이터 항목은 몇 개인가?", "c. Calculate b/a, if b/a < 1, check N, if b/a = 1, check Y. \n c. b/a를 계산하고, 만약 b/a 가 1 보다 작으면, N을 체크하고, b/a 가 1 이면 Y를 체크하라. \n\n ※ b가 a보다 큰 값은 UNKNOWN 처리됩니다. ※"],
          check: [
            {
              input: 'SRR_SQ_11',
              calcul: 'B/A<1'
            },
            {
              input: 'SRR_SQ_12',
              calcul: 'B/A<1'
            },
            {
              yes: 'SRR_SQ_13',
              no: 'SRR_SQ_13',
              notapply: 'SRR_SQ_13',
              unknown: 'SRR_SQ_13'
            }
          ]
        },
        {
          item: "CP.1(5)",
          question: ["Have all defined functions (i.e., documented with regard to source, meaning, and format) been referenced? \n 모든 정의된 (즉, 소스, 의미, 형식 관점으로 문서화된) 함수는 참조되는가?"],
          check: [
            {
              yes: 'SRR_SQ_14',
              no: 'SRR_SQ_14',
              notapply: 'SRR_SQ_14',
              unknown: 'SRR_SQ_14'
            }
          ]
        },
        {
          item: "CP.1(6)",
          question: ["Have all system functions allocated to this CSCI been allocated to software functions within this CSCI? \n CSCI에 할당된 모든 시스템 기능은 CSCI 안에 있는 소프트웨어 함수에 할당되었는가?"],
          check: [
            {
              yes: 'SRR_SQ_15',
              no: 'SRR_SQ_15',
              notapply: 'SRR_SQ_15',
              unknown: 'SRR_SQ_15'
            }
          ]
        },
        {
          item: "CP.1(7)",
          question: ["Have all referenced functions been defined (i.e., documented with precise inputs, processing, and output requirements)? \n 모든 참조되는 함수는 정의(즉, 정확한 입력, 처리, 출력 요구사항으로 문서화)되었는가?"],
          check: [
            {
              yes: 'SRR_SQ_16',
              no: 'SRR_SQ_16',
              notapply: 'SRR_SQ_16',
              unknown: 'SRR_SQ_16'
            }
          ]
        },
        {
          item: "CP.1(8)",
          question: ["Is the flow of processing (algorithms) and all decision points (conditions and alternate paths) in the flow described for all functions? \n 처리(알고리즘)의 흐름 및 그 흐름에서의 모든 결정 사항 (조건과 대체 경로)이 모든 함수에 대하여 설명되었는가?"],
          check: [
            {
              yes: 'SRR_SQ_17',
              no: 'SRR_SQ_17',
              notapply: 'SRR_SQ_17',
              unknown: 'SRR_SQ_17'
            }
          ]
        },
        {
          item: "CS.1(1)",
          question: ["Have specific standards been established for design representations (e.g., HIPO charts, program design language, flow charts, data flow diagrams)? \n 디자인 표현(예를 들면, HIPO 차트, 프로그램 설계 언어, 플로우 차트, 데이터 흐름 다이어그램 등)에 대하여 특정한 표준을 수립하였는가?"],
          check: [
            {
              yes: 'SRR_SQ_18',
              no: 'SRR_SQ_18',
              notapply: 'SRR_SQ_18',
              unknown: 'SRR_SQ_18'
            }
          ]
        },
        {
          item: "CS.1(2)",
          question: ["Have specific standards been established for calling sequence protocol between software units? \n 소프트웨어 단위 간의 호출 순서 프로토콜에 대하여 특정한 표준을 수립하였는가?"],
          check: [
            {
              yes: 'SRR_SQ_19',
              no: 'SRR_SQ_19',
              notapply: 'SRR_SQ_19',
              unknown: 'SRR_SQ_19'
            }
          ]
        },
        {
          item: "CS.1(3)",
          question: ["Have specific standards been established for external I/O protocol and format for all software units? \n 모든 소프트웨어 단위에 대하여 외부 I/O 프로토콜과 형식에 대하여 특정한 표준을 수립하였는가?"],
          check: [
            {
              yes: 'SRR_SQ_20',
              no: 'SRR_SQ_20',
              notapply: 'SRR_SQ_20',
              unknown: 'SRR_SQ_20'
            }
          ]
        },
        {
          item: "CS.1(4)",
          question: ["Have specific standards been established for error handling for all software units? \n 모든 소프트웨어 단위에 대하여 에러 처리에 대하여 특정한 표준을 수립하였는가?"],
          check: [
            {
              yes: 'SRR_SQ_21',
              no: 'SRR_SQ_21',
              notapply: 'SRR_SQ_21',
              unknown: 'SRR_SQ_21'
            }
          ]
        },
        {
          item: "CS.1(5)",
          question: ["Do all references to the same CSCI function use a single, unique name? \n 같은 CSCI 함수에 대한 모든 참조는 하나의 고유한 이름을 사용하는가?"],
          check: [
            {
              yes: 'SRR_SQ_22',
              no: 'SRR_SQ_22',
              notapply: 'SRR_SQ_22',
              unknown: 'SRR_SQ_22'
            }
          ]
        },
        {
          item: "CS.2(1)",
          question: ["Have specific standards been established for all data representations in the design? \n 설계에서 모든 데이터 표현에 대하여 특정한 표준을 수립하였는가?"],
          check: [
            {
              yes: 'SRR_SQ_23',
              no: 'SRR_SQ_23',
              notapply: 'SRR_SQ_23',
              unknown: 'SRR_SQ_23'
            }
          ]
        },
        {
          item: "CS.2(2)",
          question: ["Have specific standards been established for the naming of all data? \n 모든 데이터에 대한 명명에 대하여 특정한 표준을 수립하였는가?"],
          check: [
            {
              yes: 'SRR_SQ_24',
              no: 'SRR_SQ_24',
              notapply: 'SRR_SQ_24',
              unknown: 'SRR_SQ_24'
            }
          ]
        },
        {
          item: "CS.2(3)",
          question: ["Have specific standards been established for the definition and use of global variables? \n 전역 변수 정의 및 사용에 대하여 특정한 표준을 수립하였는가?"],
          check: [
            {
              yes: 'SRR_SQ_25',
              no: 'SRR_SQ_25',
              notapply: 'SRR_SQ_25',
              unknown: 'SRR_SQ_25'
            }
          ]
        },
        {
          item: "CS.2(4)",
          question: ["Are there procedures for establishing consistency and concurrency of multiple copies (e.g., copies at different nodes) of the same software or data base version? \n 동일한 소프트웨어 또는 데이터베이스 버전의 여러 복사본((예를 들어, 서로 다른 노드에 복사본)의 일관성과 동시성을 설정하기 위한 절차가 있는가?"],
          check: [
            {
              yes: 'SRR_SQ_26',
              no: 'SRR_SQ_26',
              notapply: 'SRR_SQ_26',
              unknown: 'SRR_SQ_26'
            }
          ]
        },
        {
          item: "CS.2(5)",
          question: ["Are there procedures for verifying consistency and concurrency of multiple copies (e.g., copies at different nodes) of the same software or data base version? \n 동일한 소프트웨어 또는 데이터베이스 버전의 여러 복사본((예를 들어, 서로 다른 노드에 복사본)의 일관성과 동시성을 검증하기 위한 절차가 있는가?"],
          check: [
            {
              yes: 'SRR_SQ_27',
              no: 'SRR_SQ_27',
              notapply: 'SRR_SQ_27',
              unknown: 'SRR_SQ_27'
            }
          ]
        },
        {
          item: "CS.2(6)",
          question: ["Do all references to the same data use a single, unique name? \n 같은 데이터에 대한 모든 참조는 하나의 고유한 이름을 사용하는가?"],
          check: [
            {
              yes: 'SRR_SQ_28',
              no: 'SRR_SQ_28',
              notapply: 'SRR_SQ_28',
              unknown: 'SRR_SQ_28'
            }
          ]
        }
      ]
    }
  ]
}

export const SRR_RADC_STFactor: IFactor = // question, check { yes, no}
{
  key: "measure05",
  tab: "ST Factor (SRR)",
  field: [
    {
      title: "ST Factor (추적성)",
      fieldheader: ["체크리스트", "YES", "NO"],
      fielddata: [
        {
          question: ["1. Is there a table(s) tracing all of the CSCI's allocated requirements to the parent system or the subsystem specification(s)? \n CSCI 별 요구사항들이 시스템 명세서 또는 서브시스템 명세서로 추적할 수 있는 테이블이 존재하는가?"],
          check: [
            {
              yes: 'SRR_ST_0',
              no: 'SRR_ST_0'
            }
          ]
        }
      ]
    }
  ]
}


export const SRR_RADC_MODAL_FIELD: IFactor[] = [SRR_RADC_AFactor, SRR_RADC_DFactor, SRR_RADC_SAFactor, SRR_RADC_SQFactor, SRR_RADC_STFactor]
