import { IFactor } from "reliability-management/ReliabilityFieldData"

export const CDR_RADC_SAFactor: IFactor =
{
  key: "measure01",
  tab: "SA Factor (CDR)",
  field: [
    {
      title: "SA Factor 체크리스트",
      fieldheader: ["ITEM", "CHECK YES(Y), NO(N), NOTAPPLY (A), OR UNKNOWN (U)", "Y", "N", "A", "U"],
      fielddata: [
        {
          item: "AM.1(3)",
          question: ["a. How many units in CSCI? \n a. CSCI에서 단위는 몇 개인가?", "b. For how many units, when an error condition is detected, is resolution of the error not determined by the calling unit? \n b. 하나의 오류 조건이 발견될 때, 호출한 단위에서 그 오류의 해결이 결정되지 않는 것은 몇 개인가?", "c. Calculate b/a, if b/a >= 0.5, check N; otherwise, check Y. \n c. b/a를 계산하고, 만약 b/a 가 0.5 이상이면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SA_0',
              calcul: 'B/A>=0.5'
            },

            {
              input: 'CDR_SA_1',
              calcul: 'B/A>=0.5'
            },

            {
              yes: 'CDR_SA_2',
              no: 'CDR_SA_2',
              notapply: 'CDR_SA_2',
              unknown: 'CDR_SA_2'
            }
          ]
        },
        {
          item: "AM.2(2)",
          question: ["Are values of all applicable external inputs with range specifications checked with respect to specified range prior to use? \n 정해진 범위를 가진 모든 사용되는 외부입력값을 사용하기 전에 정해진 범위에 대하여 검사되는가?"],
          check: [
            {
              yes: 'CDR_SA_3',
              no: 'CDR_SA_3',
              notapply: 'CDR_SA_3',
              unknown: 'CDR_SA_3'
            }
          ]
        },
        {
          item: "AM.2(3)",
          question: ["Are all applicable external inputs checked with respect to specified conflicting requests prior to use? \n 모든 사용되는 외부입력값을 사용하기 전에 정해진 상반되는 요청에 대하여 검사되는가?"],
          check: [
            {
              yes: 'CDR_SA_4',
              no: 'CDR_SA_4',
              notapply: 'CDR_SA_4',
              unknown: 'CDR_SA_4'
            }
          ]
        },
        {
          item: "AM.2(4)",
          question: ["Are all applicable external inputs checked with respect to specified illegal combinations prior to use? \n 모든 사용되는 외부입력값을 사용하기 전에 정해진 잘못된 조합에 대하여 검사되는가?"],
          check: [
            {
              yes: 'CDR_SA_5',
              no: 'CDR_SA_5',
              notapply: 'CDR_SA_5',
              unknown: 'CDR_SA_5'
            }
          ]
        },
        {
          item: "AM.2(5)",
          question: ["Are all applicable external inputs checked for reasonableness before processing begins? \n 모든 사용되는 외부입력값을 처리하기 전에 적합성에 대하여 검사되는가?"],
          check: [
            {
              yes: 'CDR_SA_6',
              no: 'CDR_SA_6',
              notapply: 'CDR_SA_6',
              unknown: 'CDR_SA_6'
            }
          ]
        },
        {
          item: "AM.2(6)",
          question: ["Are all detected errors, with respect to applicable external inputs, reported before processing begins? \n 사용되는 외부 입력값에 대하여 발견된 모든 에러가 처리하기 전에 출력되는가?"],
          check: [
            {
              yes: 'CDR_SA_7',
              no: 'CDR_SA_7',
              notapply: 'CDR_SA_7',
              unknown: 'CDR_SA_7'
            }
          ]
        },
        {
          item: "AM.2(7)",
          question: ["a. How many units in CSCI (see AM.1(3)a)? \n a. CSCI에서 단위는 몇 개인가? (AM.1(3)a를 참조하라)", "b. How many units do not perform a check to determine that all data is available before processing begins? \n b. 처리되기 전에 모든 데이터를 사용할 수 있는지를 결정하는 검사를 수행하지 않는 것은 몇 개인가?", "c. Calculate b/a, if b/a >= 0.5, check N; otherwise, check Y. \n c. b/a를 계산하고, 만약 b/a 가 0.5 이상이면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [
            {
              input: 'CDR_SA_8',
              calcul: 'B/A>=0.5'
            },
            {
              input: 'CDR_SA_9',
              calcul: 'B/A>=0.5'
            },
            {
              yes: 'CDR_SA_10',
              no: 'CDR_SA_10',
              notapply: 'CDR_SA_10',
              unknown: 'CDR_SA_10'
            }
          ]
        },
        {
          item: "AM.3(2)",
          question: ["Are critical loop and multiple transfer index parameters (e.g., supporting a mission-critical function) checked for out-of-range values before use? \n 중요한 루프 및 다중 전송 인덱스 매개 변수(예를 들어, 매우 중요한 기능을 지원하는)에 대하여 사용하기 전에 범위를 벗어난 값을 검사하는가?"],
          check: [
            {
              yes: 'CDR_SA_11',
              no: 'CDR_SA_11',
              notapply: 'CDR_SA_11',
              unknown: 'CDR_SA_11'
            }
          ]
        },
        {
          item: "AM.3(3)",
          question: ["Are all critical subscripts (e.g., supporting a mission-critical function checked for out-of-range values before use? \n 모든 중요한 첨자(예를 들어, 매우 중요한 함수를 지원하는)에 대하여 사용하기 전에 범위를 벗어난 값을 검사하는가?"],
          check: [
            {
              yes: 'CDR_SA_12',
              no: 'CDR_SA_12',
              notapply: 'CDR_SA_12',
              unknown: 'CDR_SA_12'
            }
          ]
        },
        {
          item: "AM.3(4)",
          question: ["Are all critical output data (e.g., supporting a mission-critical function checked for reasonable values prior to final outputting? \n 모든 중요한 출력 데이터(예를 들어, 매우 중요한 함수를 지원하는)에 대하여 최종 출력하기 전에 적합한 값인지를 검사하는가?"],
          check: [
            {
              yes: 'CDR_SA_13',
              no: 'CDR_SA_13',
              notapply: 'CDR_SA_13',
              unknown: 'CDR_SA_13'
            }
          ]
        }
      ]
    }
  ]
}


export const CDR_RADC_SQFactor: IFactor =
{
  key: "measure02",
  tab: "SQ Factor (CDR)",
  field: [
    {
      title: "SQ Factor 체크리스트",
      fieldheader: ["ITEM", "CHECK YES(Y), NO(N), NOTapply (A), OR UNKNOWN (U)", "Y", "N", "A", "U"],
      fielddata: [
        {
          item: "AU.1(2)",
          question: ["a. How many estimated executable lines of source code? (total from all units) \n a. 소스코드의 예상 실행 라인 수는 얼마인가? (모든 단위로부터 합계)", "b. How many estimated executable lines of source code necessary to handle hardware and device interface protocol? \n b. 하드웨어와 장치 인터페이스 프로토콜을 처리하는데 필요한 소스코드의 예상 실행 라인 수는 얼마인가?", "c. Calculate b/a, if b/a > .3, check N, if b/a <=.3, check Y. \n c. b/a를 계산하고, 만약 b/a 가 0.3 보다 크면, N을 체크하고, b/a 가 0.3 보다 같거나 작으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_0',
              calcul: 'B/A>0.3'
            },

            {
              input: 'CDR_SQ_1',
              calcul: 'B/A>0.3'
            },

            {
              yes: 'CDR_SQ_2',
              no: 'CDR_SQ_2',
              notapply: 'CDR_SQ_2',
              unknown: 'CDR_SQ_2'
            }
          ]
        },
        {
          item: "AU.1(3)",
          question: ["a. How many units (NM) in CSCI? \n a. CSCI에 단위(NM)는 몇 개인가?", "b. How many units perform processing of hardware and/or device interface protocol? \n b. 하드웨어와 장치 인터페이스 프로토콜을 처리하는데 수행하는 단위는 몇 개인가?", "c. Calculate b/a, if b/a > .3, check N, if b/a <= .3, check Y. \n c. b/a를 계산하고, 만약 b/a 가 0.3 보다 크면, N을 체크하고, b/a 가 0.3 보다 같거나 작으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_3',
              calcul: 'B/A>0.3'
            },

            {
              input: 'CDR_SQ_4',
              calcul: 'B/A>0.3'
            },

            {
              yes: 'CDR_SQ_5',
              no: 'CDR_SQ_5',
              notapply: 'CDR_SQ_5',
              unknown: 'CDR_SQ_5'
            }
          ]
        },
        {
          item: "AU.1(4)",
          question: ["a. How much estimated processing time is typically spent executing the entire CSCI? \n a. 전체 CSCI를 실행하는데 전형적으로 소요되는 예상 처리시간은 얼마인가?", "b. How much estimated processing time is typically spent in execution of hardware and device interface protocol units? \n b. 하드웨어와 장치 인터페이스 프로토콜 단위를 실행하는데 소요되는 예상 처리 시간은 얼마인가?", "c. Calculate b/a, if b/a > .3, check N, if b/a <=.3, check Y. \n c. b/a를 계산하고, 만약 b/a 가 0.3 보다 크면, N을 체크하고, b/a 가 0.3 보다 같거나 작으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_6',
              calcul: 'B/A>0.3'
            },

            {
              input: 'CDR_SQ_7',
              calcul: 'B/A>0.3'
            },

            {
              yes: 'CDR_SQ_8',
              no: 'CDR_SQ_8',
              notapply: 'CDR_SQ_8',
              unknown: 'CDR_SQ_8'
            }
          ]
        },
        {
          item: "CP.1(1)",
          question: ["a. How many units clearly and precisely define all inputs, processing, and outputs? \n a. 모든 입력, 처리, 출력을 명확하고 정확하게 정의한 단위는 몇 개인가?", "b. Calculate a/NM, if a/NM <= 0.5, check N, if a/NM > 0.5, check Y. \n b. a/NM를 계산하고, 만약 a/NM이 0.5 보다 같거나 작으면, N을 체크하고, a/NM이 0.5 보다 크면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_9',
              calcul: 'A/NM<=0.5'
            },

            {
              yes: 'CDR_SQ_10',
              no: 'CDR_SQ_10',
              notapply: 'CDR_SQ_10',
              unknown: 'CDR_SQ_10'
            }
          ]
        },
        {
          item: "CP.1(2)",
          question: ["a. How many data references are identified? (total from all units) \n a. 식별된 데이터 참조는 몇 개인가? (모든 단위로부터 합계)", "b. How many identified data references are documented with regard to source, meaning, and format? (total from all units) \n b. 식별된 데이터 참조는 몇 개가 소스, 의미, 형식의 관점으로 문서화되었는가? (모든 단위로부터 합계)", "c. Calculate b/a, if b/a <= 0.5, check N, if b/a > 0.5, check Y. \n c. b/a를 계산하고, 만약 b/a 가 0.5 보다 같거나 작으면, N을 체크하고, b/a 가 0.5 보다 크면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_11',
              calcul: 'B/A<=0.5'
            },

            {
              input: 'CDR_SQ_12',
              calcul: 'B/A<=0.5'
            },

            {
              yes: 'CDR_SQ_13',
              no: 'CDR_SQ_13',
              notapply: 'CDR_SQ_13',
              unknown: 'CDR_SQ_13'
            }
          ]
        },
        {
          item: "CP.1(3)",
          question: ["a. How many data items are defined (i.e., documented with regard to source, meaning, and format)? \n a. 데이터 항목은 몇 개가 정의(소스, 의미, 형식의 관점으로 문서화)되었는가?", "b. How many data items are referenced? \n b. 데이터 항목은 몇 개가 참조되었는가?", "c. Calculate b/a, if b/a <= 0.5, check N, if b/a > 0.5, check Y. \n c. b/a를 계산하고, 만약 b/a 가 0.5 보다 같거나 작으면, N을 체크하고, b/a 가 0.5 보다 크면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_14',
              calcul: 'B/A<=0.5'
            },

            {
              input: 'CDR_SQ_15',
              calcul: 'B/A<=0.5'
            },

            {
              yes: 'CDR_SQ_16',
              no: 'CDR_SQ_16',
              notapply: 'CDR_SQ_16',
              unknown: 'CDR_SQ_16'
            }
          ]
        },
        {
          item: "CP.1(4)",
          question: ["a. How many data references are identified? (from CP1(2)a above) \n a. 식별된 데이터 참조는 몇 개인가? (위의 CP.1(2)a로부터)", "b. How many identified data references are computed or obtained from an external source (e.g., referencing global data with preassigned values, input parameters with preassigned values)? (total from all units) \n b. 외부 소스로부터 계산되거나 얻어지는 (예를 들어, 미리 지정된 값이 있는 전역 데이터, 미리 지정된 값이 있는 입력 파라미터 참조 등) 식별된 데이터 참조는 몇 개인가? (모든 단위로부터 합계)", "c. Calculate b/a, if b/a <= 0.5, check N, if b/a > 0.5, check Y. \n c. b/a를 계산하고, 만약 b/a 가 0.5 보다 같거나 작으면, N을 체크하고, b/a 가 0.5 보다 크면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_17',
              calcul: 'B/A<=0.5'
            },

            {
              input: 'CDR_SQ_18',
              calcul: 'B/A<=0.5'
            },

            {
              yes: 'CDR_SQ_19',
              no: 'CDR_SQ_19',
              notapply: 'CDR_SQ_19',
              unknown: 'CDR_SQ_19'
            }
          ]
        },
        {
          item: "CP.1(9)",
          question: ["a. How many units define all conditions and alternative processing options for each decision point? (total from all units) \n a. 모든 조건과 대체 처리 옵션이 각각의 결정 항목에 대하여 정의된 단위는 몇 개인가? (모든 단위로부터 합계)", "b. Calculate R = a/NM, if R <= 0.5, check N, if R > 0.5, check Y. \n b. R = a/NM를 계산하고, 만약 R이 0.5 보다 같거나 작으면, N을 체크하고, R이 0.5 보다 크면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_20',
              calcul: 'A/NM<=0.5'
            },

            {
              yes: 'CDR_SQ_21',
              no: 'CDR_SQ_21',
              notapply: 'CDR_SQ_21',
              unknown: 'CDR_SQ_21'
            }
          ]
        },
        {
          item: "CP.1(10)",
          question: ["a. For how many units, are all parameters in the argument list used? \n a. 인수 목록에 있는 모든 파라미터가 사용된 단위는 몇 개인가?", "b. Calculate R = a/NM, if R <= 0.5, check N, if R > 0.5, check Y. \n b. R = a/NM를 계산하고, 만약 R이 0.5 보다 같거나 작으면, N을 체크하고, R이 0.5 보다 크면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_22',
              calcul: 'A/NM<=0.5'
            },

            {
              yes: 'CDR_SQ_23',
              no: 'CDR_SQ_23',
              notapply: 'CDR_SQ_23',
              unknown: 'CDR_SQ_23'
            }
          ]
        },
        {
          item: "CS.1(11)",
          question: ["a. How many software problem reports have been recorded, to date? \n a. 현재까지, 소프트웨어 문제 보고는 몇 개나 기록되었는가?", "b. How many recorded software problem reports have been closed (resolved), to date? \n b. 현재까지, 기록된 소프트웨어 문제 보고는 몇 개나 완료(해결)되었는가?", "c. Calculate b/a, if b/a <= 0.75, check N, if b/a > 0.75, check Y. \n c. b/a를 계산하고, 만약 b/a 가 0.75 보다 같거나 작으면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_24',
              calcul: 'B/A<=0.75'
            },

            {
              input: 'CDR_SQ_25',
              calcul: 'B/A<=0.75'
            },

            {
              yes: 'CDR_SQ_26',
              no: 'CDR_SQ_26',
              notapply: 'CDR_SQ_26',
              unknown: 'CDR_SQ_26'
            }
          ]
        },
        {
          item: "CS.1(1)",
          question: ["a. For how many units are all design representations in the formats of the established standard? \n a. 모든 설계 표현이 수립된 표준의 형식에 있는 단위는 몇 개인가?", "b. If a/NM <= 0.5, check N, otherwise check Y. \n b. a/NM이 0.5 보다 같거나 작으면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_27',
              calcul: 'A/NM<=0.5'
            },

            {
              yes: 'CDR_SQ_28',
              no: 'CDR_SQ_28',
              notapply: 'CDR_SQ_28',
              unknown: 'CDR_SQ_28'
            }
          ]
        },
        {
          item: "CS.1(2)",
          question: ["a. For how many units does the calling sequence protocol (between units) comply with the established standard? \n a. (단위 사이의) 호출 순서 프로토콜이 수립된 표준에 적합한 단위는 몇 개인가?", "b. If a/NM <= 0.5, check N, otherwise check Y. \n b. a/NM이 0.5 보다 같거나 작으면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_29',
              calcul: 'A/NM<=0.5'
            },

            {
              yes: 'CDR_SQ_30',
              no: 'CDR_SQ_30',
              notapply: 'CDR_SQ_30',
              unknown: 'CDR_SQ_30'
            }
          ]
        },
        {
          item: "CS.1(3)",
          question: ["a. For how many units does the I/O protocol and format comply with the established standard? \n a. I/O 프로토콜과 형식이 수립된 표준과 부합하는 단위는 몇 개인가?", "b. If a/NM <= 0.5, check N, otherwise check Y. \n b. a/NM이 0.5 보다 같거나 작으면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_31',
              calcul: 'A/NM<=0.5'
            },

            {
              yes: 'CDR_SQ_32',
              no: 'CDR_SQ_32',
              notapply: 'CDR_SQ_32',
              unknown: 'CDR_SQ_32'
            }
          ]
        },
        {
          item: "CS.1(4)",
          question: ["a. For how many units does the handling of errors comply with the established standard? \n a. 에러 처리가 수립된 표준과 부합하는 단위는 몇 개인가?", "b. If a/NM <= 0.5, check N, otherwise check Y. \n b. a/NM이 0.5 보다 같거나 작으면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_33',
              calcul: 'A/NM<=0.5'
            },

            {
              yes: 'CDR_SQ_34',
              no: 'CDR_SQ_34',
              notapply: 'CDR_SQ_34',
              unknown: 'CDR_SQ_34'
            }
          ]
        },
        {
          item: "CS.1(5)",
          question: ["a. For how many units do all references to the unit use the same, unique name? \n a. 단위에서 모든 참조가 동일한 고유한 이름을 사용하는 단위는 몇 개인가?", "b. If a/NM <= 0.5, check N, otherwise check Y. \n b. a/NM이 0.5 보다 같거나 작으면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_35',
              calcul: 'A/NM<=0.5'
            },

            {
              yes: 'CDR_SQ_36',
              no: 'CDR_SQ_36',
              notapply: 'CDR_SQ_36',
              unknown: 'CDR_SQ_36'
            }
          ]
        },
        {
          item: "CS.2(1)",
          question: ["a. For how many units does all data representation comply with the established standard? \n a. 모든 데이터 표현이 수립된 표준과 부합하는 단위는 몇 개인가?", "b. If a/NM <= 0.5, check N, otherwise check Y. \n b. a/NM이 0.5 보다 같거나 작으면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_37',
              calcul: 'A/NM<=0.5'
            },

            {
              yes: 'CDR_SQ_38',
              no: 'CDR_SQ_38',
              notapply: 'CDR_SQ_38',
              unknown: 'CDR_SQ_38'
            }
          ]
        },
        {
          item: "CS.2(2)",
          question: ["a. For how many units does the naming of all data comply with the established standard? \n a. 모든 데이터에 대한 명명이 수립된 표준과 부합하는 단위는 몇 개인가?", "b. If a/NM <= 0.5, check N, otherwise check Y. \n b. a/NM이 0.5 보다 같거나 작으면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_39',
              calcul: 'A/NM<=0.5'
            },

            {
              yes: 'CDR_SQ_40',
              no: 'CDR_SQ_40',
              notapply: 'CDR_SQ_40',
              unknown: 'CDR_SQ_40'
            }
          ]
        },
        {
          item: "CS.2(3)",
          question: ["a. For how many units is the definition and use of all global variables in accordance with the established standard? \n a. 모든 전역 변수의 정의와 사용이 수립된 표준에 따른 단위는 몇 개인가?", "b. If a/NM <= 0.5, check N, otherwise check Y. \n b. a/NM이 0.5 보다 같거나 작으면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_41',
              calcul: 'A/NM<=0.5'
            },

            {
              yes: 'CDR_SQ_42',
              no: 'CDR_SQ_42',
              notapply: 'CDR_SQ_42',
              unknown: 'CDR_SQ_42'
            }
          ]
        },
        {
          item: "CS.2(6)",
          question: ["a. For how many units do all references to the same data use a single, unique name? \n a. 동일한 데이터에 대한 모든 참조가 하나의 고유한 이름을 사용하는 단위는 몇 개인가?", "b. If a/NM < 1, check N, otherwise check Y. \n b. a/NM이 1 보다 작으면, N을 체크하고, 그렇지 않으면 Y를 체크하라."],
          check: [

            {
              input: 'CDR_SQ_43',
              calcul: 'A/NM<1'
            },

            {
              yes: 'CDR_SQ_44',
              no: 'CDR_SQ_44',
              notapply: 'CDR_SQ_44',
              unknown: 'CDR_SQ_44'
            }
          ]
        }
      ]
    }
  ]
}


export const CDR_RADC_STFactor: IFactor =
{
  key: "measure03",
  tab: "ST Factor (CDR)",
  field: [
    {
      title: "ST Factor (추적성)",
      fieldheader: ["체크리스트", "YES", "NO"],
      fielddata: [
        {
          question: ["1. Does the description of each software unit identify all the requirements (specified at the top-level CSC or CSCI level) that the unit helps satisfy? \n 각 소프트웨어 unit들의 설계 명세가 CSC 또는 CSCI의 모든 요구사항들을 식별 할 수 있는가?"],
          check: [
            {
              yes: 'CDR_ST_0',
              no: 'CDR_ST_0'
            }
          ]
        },
        {
          question: ["2. Is the decomposition of top-level CSCs into lower-level CSCs and software units graphically depicted? \n Lower-level CSCs 와 소프트웨어 unit들은 top-level CSC로부터 세분화되었음을 도식화하여 표현하였는가?"],
          check: [
            {
              yes: 'CDR_ST_1',
              no: 'CDR_ST_1'
            }
          ]
        }
      ]
    }
  ]
}


export const CDR_RADC_MODAL_FIELD: IFactor[] = [CDR_RADC_SAFactor, CDR_RADC_SQFactor, CDR_RADC_STFactor]