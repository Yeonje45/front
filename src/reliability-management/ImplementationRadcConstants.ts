import { IFactor } from "reliability-management/ReliabilityFieldData"

export const IMP_RADC_SLFactor: IFactor =
{
  key: "measure01",
  tab: "SL Factor",
  field: [
    {
      title: "SL Factor (구현 언어 유형)",
      fieldheader: ["SL Factor", "특징", "값 입력"],
      fielddata: [
        {
          item: "ALOC",
          question: ["Assembly language lines of code for CSCI \n 시스템 구현에 사용된 어셈블리 언어의 총 소스 라인 수"],
          check: [
            {
              input: 'IMP_SL_0'
            }
          ]
        },
        {
          item: "HLOC",
          question: ["Higher-order-language line of code for CSCI \n 시스템 구현에 사용된 Higher Order 언어의 총 소스 라인 수"],
          check: [
            {
              input: 'IMP_SL_1'
            }
          ]
        }
      ]
    }
  ]
}


export const IMP_RADC_SMFactor: IFactor =
{
  key: "measure02",
  tab: "SM Factor",
  field: [
    {
      title: "SM Factor(모듈성)",
      fieldheader: ["SM Factor", "특징", "값 입력"],
      fielddata: [
        {
          item: "U",
          question: ["Number units in CSCI with SLOC <= 200 \n 소스코드의 라인 수가 200 미만인 개수"],
          check: [
            {
              input: 'IMP_SM_0'
            }
          ]
        },
        {
          item: "W",
          question: ["Number units in CSCI with 200 < SLOC <= 3000 \n 소스코드의 라인 수가 200 이상 3000 미만인 개수"],
          check: [
            {
              input: 'IMP_SM_1'
            }
          ]
        },
        {
          item: "X",
          question: ["Number units in CSCI with SLOC > 3000 \n 소스코드의 라인 수가 3000 이상인 개수"],
          check: [
            {
              input: 'IMP_SM_2'
            }
          ]
        }
      ]
    }
  ]
}


export const IMP_RADC_SXFactor: IFactor =
{
  key: "measure03",
  tab: "SX Factor",
  field: [
    {
      title: "SX Factor (복잡도)",
      fieldheader: ["SX Factor", "특징", "값 입력"],
      fielddata: [
        {
          item: "a",
          question: ["Number units in CSCI with complexity >= 20 \n 복잡도가 20보다 큰 모듈 개수"],
          check: [
            {
              input: 'IMP_SX_0'
            }
          ]
        },
        {
          item: "b",
          question: ["Number units in CSCI with 7 <= complexity < 20 \n 복잡도가 7 이상 20 미만인 모듈 개수"],
          check: [
            {
              input: 'IMP_SX_1'
            }
          ]
        },
        {
          item: "c",
          question: ["Number units in CSCI with complexity < 7 \n 복잡도가 7보다 작은 모듈 개수"],
          check: [
            {
              input: 'IMP_SX_2'
            }
          ]
        }
      ]
    }
  ]
}


export const IMP_RADC_SRFactor: IFactor =
{
  key: "measure04",
  tab: "SR Factor",
  field: [
    {
      title: "SR Factor(표준검토)",
      fieldheader: ["ITEM", "CHECK YES(Y), NO(N), NOTAPPLY (A), OR UNKNOWN (U)", "Y", "N", "A", "U"],
      fielddata: [
        {
          item: "MO.1(2)",
          question: ["Are all units coded and tested according to structural techniques? \n 모든 unit은 구조적인 기법을 사용하여 구현/시험 되었는가?"],
          check: [
            {
              yes: 'IMP_SR_0',
              no: 'IMP_SR_0',
              notapply: 'IMP_SR_0',
              unknown: 'IMP_SR_0'
            },
          ]
        },
        {
          item: "MO.1(3)",
          question: ["a.   How many units in CSCI? \n a.   CSCI의unit은 모두 몇 개인가?(NM)", "b.   How many units with estimated executable lines of source code less than 100 lines? \n b.   MLOC가100보다작거나같은unit은몇개인가?", "c.  Calculate b/NM and enter score. \n c.  b/NM", "d. If b/NM<=0.5 circle N, other score. \n d. b/NM<=0.5이면 No, 그렇지 않으면 Yes"],
          check: [
            {
              input: 'IMP_SR_1', // Implementation SR Factor NM
              calcul: 'B/NM<=0.5'
            },
            {
              input: 'IMP_SR_2',
              calcul: 'B/NM<=0.5'
            },
            {
              input: 'IMP_SR_3',
              calcul: 'B/NM',
            },
            {
              yes: 'IMP_SR_4',
              no: 'IMP_SR_4',
              notapply: 'IMP_SR_4',
              unknown: 'IMP_SR_4'
            },
          ]
        },
        {
          item: "MO.1(4)",
          question: ["a.   How many parameters are there in the calling sequence?(total from all units) \n a.  몇 개의 파라미터가 calling sequence 안에 포함되어 있는가?(전체unit합)", "b.   How many calling sequence parameters are control variables (e.g., select an operating mode or sub mode , direct the sequential flow, directly influence the function of the software)? (total from all units) calling sequence \n b. 안에 포함된 몇 개의 파라미터가 control variable인가? (동작모드를 결정하는 인자, flow의 방향을 바꿀 수 있는 인자, 소프트웨어의 기능에 직접적으로 영향을 미치는 인자 등)(전체unit합)", "c. Calculate1-(b/a) and enter score. \n c. 1-(b/a)"],
          check: [
            {
              input: 'IMP_SR_5',
              calcul: '1-(B/A)'
            },
            {
              input: 'IMP_SR_6',
              calcul: '1-(B/A)'
            },
            {
              input: 'IMP_SR_7'
            }
          ]
        },
        {
          item: "MO.1(5)",
          question: ["a.   For how many units is all input data passed into the unit through calling sequence parameters (i.e., no data is input through global are as or input statements?) \n a.   unit이 전달받는 모든 입력데이터가 calling sequence의 인자를 통해 전달되는가? (전역변수를 통한전달 혹은 입력을 받는 기능을 통한 전달은 없는가?)(몇개의unit이Yes인가?)", "b.   Calculate a/NM and enter score. \n b.   a/NM", "c.  If a/NM<1circleN, otherwise circle Y. \n c.  a/NM<1이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_8',
              calcul: 'A/NM<1'
            },
            {
              input: 'IMP_SR_9',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_10',
              no: 'IMP_SR_10',
              notapply: 'IMP_SR_10',
              unknown: 'IMP_SR_10'
            }
          ]
        },
        {
          item: "MO.1(6)",
          question: ["a.   For how many units is output data passed back to the calling unit through calling sequence parameters (i.e., no data is out put through global areas)? \n a.  모든calling unit으로의 출력은 calling sequence의 인자를 통해 전달 되는가? (전역변수를 통한 전달은 없는가?) (몇 개의 unit이 Yes 인가?)", "b.   Calculate a/NM and enter score. \n b.   a/NM", "c.  If a/NM<1circleN, otherwise circle Y. \n c.  a/NM<1이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_11',
              calcul: 'A/NM<1'
            },
            {
              input: 'IMP_SR_12',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_13',
              no: 'IMP_SR_13',
              notapply: 'IMP_SR_13',
              unknown: 'IMP_SR_13'
            }
          ]
        },
        {
          item: "MO.1(7)",
          question: ["a.   For how many units is control always returned to the calling unit when execution is completed? \n a.  실행이 끝났을 때 control은 항상calling unit으로 돌아가는가? (몇개의unit이Yes인가?)", "b.   Calculate a/NM and enter score. \n b.   a/NM", "c.  If a/NM<1 circle N, otherwise circle Y. \n c.  a/NM<1이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_14',
              calcul: 'A/NM<1'
            },
            {
              input: 'IMP_SR_15',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_16',
              no: 'IMP_SR_16',
              notapply: 'IMP_SR_16',
              unknown: 'IMP_SR_16'
            }
          ]
        },
        {
          item: "MO.1(8)",
          question: ["a.   For how many units is temporary storage (i.e., workspace reserved for immediate or partial results) used only by the unit during execution(i.e., is not shared with other units)? \n a.  임시저장공간(중간계산 결과 등을 저장하기 위해 사용되는 공간) 은 실행 중에 해당unit안에서만 사용되는가? (다른unit과공유하지않는가?) (몇개의unit이Yes인가?)", "b.   Calculate a/NM and enter score. \n b.  a/NM", "c.   If a/NM<1circle N, otherwise circle Y. \n c.   a/NM<1이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_17',
              calcul: 'A/NM<1'
            },
            {
              input: 'IMP_SR_18',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_19',
              no: 'IMP_SR_19',
              notapply: 'IMP_SR_19',
              unknown: 'IMP_SR_19'
            }
          ]
        },
        {
          item: "MO.1(9)",
          question: ["a.   How many units have A single processing objective (i.e., all processing with in the unit is related to the same objective)? \n a.  해당unit은 하나의 목적을 위한 processing을 수행하는가? ( unit의 모든processing은 동일한 목적을 가지고 있는가?)(몇개의Unit이Yes인가?)", "b.   Calculate a/NM and enter score. \n b.   a/NM", "c.   If a/nm=<0.5 circle N, otherwise circle Y. \n c.   a/NM<=0.5이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_20',
              calcul: 'A/NM<=0.5'
            },
            {
              input: 'IMP_SR_21',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_22',
              no: 'IMP_SR_22',
              notapply: 'IMP_SR_22',
              unknown: 'IMP_SR_22'
            }
          ]
        },
        {
          item: "SI.1(2)",
          question: ["a. How many units are independent of the source of the input and the destination of the output? \n a. 해당 unit은 input의 출처와 output의 목적지로부터 독립인가? (몇 개의 unit이 Yes 인가?)", "b. Calculate a/NM and enter score. \n b. a/NM", "c. If a/NM =< 0.5 circle N, otherwise circle Y. \n c. a/NM <= 0.5 이면 No, 그렇지 않으면 Yes"],
          check: [
            {
              input: 'IMP_SR_23',
              calcul: 'A/NM<=0.5'
            },
            {
              input: 'IMP_SR_24',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_25',
              no: 'IMP_SR_25',
              notapply: 'IMP_SR_25',
              unknown: 'IMP_SR_25'
            }
          ]
        },
        {
          item: "SI.1(3)",
          question: ["a. How many units are independent of knowledge of prior processing? \n a. 해당 unit은 이전 processing의 지식으로부터 독립인가? (몇 개의 unit이 Yes 인가?)", "b. Calculate a/NM and enter score. \n b. a/NM", "c. If a/NM =< 0.5 circle N, otherwise circle Y. \n c. a/NM <= 0.5 이면 No, 그렇지 않으면 Yes"],
          check: [
            {
              input: 'IMP_SR_26',
              calcul: 'A/NM<=0.5'
            },
            {
              input: 'IMP_SR_27',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_28',
              no: 'IMP_SR_28',
              notapply: 'IMP_SR_28',
              unknown: 'IMP_SR_28'
            }
          ]
        },
        {
          item: "SI.1(4)",
          question: ["a.  For how many units does the unit description/ prologue include input, output, processing, and limitations? \n a. 해당unit의설명(주석)에는input, output, processing 하는 것, 제약사항이 포함되어 있는가?(몇개의unit이Yes인가?)", "b.   Calculate a/NM and enter score. \n b.   a/NM", "c.   If a/NM=<0.5circle N , otherwise circle Y. \n c.   a/NM<=0.5이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_29',
              calcul: 'A/NM<=0.5'
            },
            {
              input: 'IMP_SR_30',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_31',
              no: 'IMP_SR_31',
              notapply: 'IMP_SR_31',
              unknown: 'IMP_SR_31'
            }
          ]
        },
        {
          item: "SI.1(5)",
          question: ["a.  How many units with number of entrances = 1, number of exits=1 ? \n a. SI.1(5)(unit)이 Yes인 unit은 몇 개인가?", "b.   Calculate a/NM and enter score. \n b.   a/NM", "c.   If a/NM<=0.5 circle N , otherwise circle Y. \n c.   a/NM<=0.5이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_32',
              calcul: 'A/NM<=0.5'
            },
            {
              input: 'IMP_SR_33',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_34',
              no: 'IMP_SR_34',
              notapply: 'IMP_SR_34',
              unknown: 'IMP_SR_34'
            }
          ]
        },
        {
          item: "SI.1(7)",
          question: ["a. How many unique data items are in common blocks? \n a. common block들 안에 포함된 unique한 data item은 몇 개인가?", "b. How many unique common blocks? \n b. unique common block은 몇 개인가?", "c. Calculate b/a and enter score. \n c. b/a"],
          check: [
            {
              input: 'IMP_SR_35',
              calcul: 'B/A'
            },
            {
              input: 'IMP_SR_36',
              calcul: 'B/A'
            },
            {
              input: 'IMP_SR_37'
            }
          ]
        },
        {
          item: "SI.1(10)",
          question: ["Do all description so fall units identify all interfacing units and all interfacing hardware? \n 해당unit의설명(주석)에는 모든 상호작용하는unit과 하드웨어가 명시되어 있는가?(모든unit이Yes이면Yes, 그렇지 않으면No)"],
          check: [
            {
              yes: 'IMP_SR_38',
              no: 'IMP_SR_38',
              notapply: 'IMP_SR_38',
              unknown: 'IMP_SR_38'
            }
          ]
        },
        {
          item: "SI.2(1)",
          question: ["a. How many units are implemented in a structured language or using a preprocessor? \n a. 구조적 언어나 preprocessor로 구현된 unit은 몇 개인가?", "b. Calculate a/NM and enter score. \n b. a/NM", "c. If a/NM =< 0.5 circle N, otherwise circle Y. \n c. a/NM <= 0.5 이면 No, 그렇지 않으면 Yes"],
          check: [
            {
              input: 'IMP_SR_39',
              calcul: 'A/NM<=0.5'
            },
            {
              input: 'IMP_SR_40',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_41',
              no: 'IMP_SR_41',
              notapply: 'IMP_SR_41',
              unknown: 'IMP_SR_41'
            }
          ]
        },
        {
          item: "SI.4(1)",
          question: ["a.  For how many units is the flow of control from top to bottom (i.e., flow of control does not jump erratically)? \n a.  control flow는 위에서 아래로 진행되는가? (이상한jump가없는가?) (몇개의unit이Yes인가?)", "b.   Calculate a/NM and enter score. \n b.   a/NM", "c.   If a/NM=<0.5circle N, otherwise circle Y. \n c.   a/NM<=0.5이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_42',
              calcul: 'A/NM<=0.5'
            },
            {
              input: 'IMP_SR_43',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_44',
              no: 'IMP_SR_44',
              notapply: 'IMP_SR_44',
              unknown: 'IMP_SR_44'
            }
          ]
        },
        {
          item: "SI.4(2)",
          question: ["a.  How many executable lines of code(LOC)in this CSCI? \n a.  CSCI의 소스코드 라인수는 얼마인가?(SLOC)", "b.   How many negative Boolean and compound Boolean expressions are used?(total from all units) \n b.   얼마나 많은 not boolean, 복합 Boolean expression을 사용하였는가? (전체unit의합)", "c.  Calculate1–(b/LOC)and enters core. \n c.  1-(b/SLOC)"],
          check: [
            {
              input: 'IMP_SR_45',  // Implementation SR Factor SLOC
              calcul: '1-(B/SLOC)'
            },
            {
              input: 'IMP_SR_46',
              calcul: '1-(B/SLOC)'
            },
            {
              input: 'IMP_SR_47',
            }
          ]
        },
        {
          item: "SI.4(3)",
          question: ["a.  How many loops (e.g., WHILE, DO/FOR,REPEAT)? (total from all units) \n a. 얼마나 많은loop이있는가?(WHILE,FOR의수)(전체unit의합)", "b.   How many loops with unnatural exits (e.g., jumps out of loop, return statement)?(total from all units) \n b.   얼마나 많은loop이 비정상적으로 탈출하는가? (break, return등)(전체unit의합)", "c.  Calculate1–(b/a)and enter score. \n c.  1-(b/a)"],
          check: [
            {
              input: 'IMP_SR_48',
              calcul: '1-(B/A)'
            },
            {
              input: 'IMP_SR_49',
              calcul: '1-(B/A)'
            },
            {
              input: 'IMP_SR_50'
            }
          ]
        },
        {
          item: "SI.4(4)",
          question: ["a.  How many iteration loops (i.e., DO/ FOR loops)? (total from all units) \n a.  iteration loop은 몇 개인가?(FOR의수)(전체unit의합)", "b.   In how many iteration loops are in dices modified to alter fundamental processing of the loop?(total from all units) \n b.   iteration loop중 반복 변수를 loop 처리 중에 바꾸어 반복에 영향을 주는 loop은 몇 개 인가? (전체unit의합)", "c.  Calculate1–(b/a)and enter score. \n c.  1-(b/a)"],
          check: [
            {
              input: 'IMP_SR_51',
              calcul: '1-(B/A)'
            },
            {
              input: 'IMP_SR_52',
              calcul: '1-(B/A)'
            },
            {
              input: 'IMP_SR_53'
            }
          ]
        },
        {
          item: "SI.4(5)",
          question: ["a.  How many units free from all self-modificationofcode(i.e.,doesnotalterinstructions,overlaysofcode,etc.  )? \n a. 해당unit은 스스로 소스코드를 수정하는 부분이 없는가? (몇개의unit이Yes인가?)", "b.   Calculate a/NM and enter score. \n b.   a/NM", "c.   If a/NM=<0.5circleN, otherwise circle Y. \n c.   a/NM<=0.5이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_54',
              calcul: 'A/NM<=0.5'
            },
            {
              input: 'IMP_SR_55',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_56',
              no: 'IMP_SR_56',
              notapply: 'IMP_SR_56',
              unknown: 'IMP_SR_56'
            }
          ]
        },
        {
          item: "SI.4(6)",
          question: ["a.  How many statement label sex cluding labels for format statements? (total from all units) \n a.  Label된statement는몇개 인가? (단순format용 이외에 실제 사용) (전체unit의합)", "b.   Calculate1–(a/LOC) and enter score. \n b.  1-(a/SLOC)"],
          check: [
            {
              input: 'IMP_SR_57',
              calcul: '1-(A/SLOC)'
            },
            {
              input: 'IMP_SR_58'
            }
          ]
        },
        {
          item: "SI.4(7)",
          question: ["a.  What is the maximum nesting level?(total from all units) \n a. 최대loop nesting level이 얼마인가?(전체unit의최대값)", "b.  Calculate1/a and enter score. \n b.  1/a"],
          check: [
            {
              input: 'IMP_SR_59',
              calcul: '1/A'
            },
            {
              input: 'IMP_SR_60'
            }
          ]
        },
        {
          item: "SI.4(8)",
          question: ["a.  How many branches, conditional and unconditional? (total from all units) \n a.  branch의수는 몇 개 인가?(go to, break등 포함) (전체 unit의 합)", "b.  Calculate1-(a/LOC)and enter score. \n b.  1-(a/SLOC)"],
          check: [
            {
              input: 'IMP_SR_61',
              calcul: '1-(A/SLOC)'
            },
            {
              input: 'IMP_SR_62'
            }
          ]
        },
        {
          item: "SI.4(9)",
          question: ["a.  How many declaration statements?(total from all units) \n a.  data declaration statement는 몇 개인가?(전체unit의합)", "b.   How many data manipulation statements?(total from all units) \n b.   data manipulation statement는 몇 개인가?(전체unit의합)", "c.  Calculate1–((a + b)/LOC)and enter score. \n c. 1-((a + b)/SLOC)"],
          check: [
            {
              input: 'IMP_SR_63',
              calcul: '1-((A+B)/SLOC)'
            },
            {
              input: 'IMP_SR_64',
              calcul: '1-((A+B)/SLOC)'
            },
            {
              input: 'IMP_SR_65'
            }
          ]
        },
        {
          item: "SI.4(10)",
          question: ["a.  How many total data items(DD),local and global, are used?(total from all units) \n a.  (모든, local, global을 포함한) 몇 개의 data item이 사용 되는가? (전체unit의합(TDD))", "b.   How many data items are used locally (e.g., variables declared locally and value parameters)?(total from all units) \n b.   local로만사용되는data item은 몇개인가?(전체unit의합)", "c.  Calculate b/a and enter score. \n c.  b/a"],
          check: [
            {
              input: 'IMP_SR_66', // Implementation SR Factor TDD
              calcul: 'B/A'
            },
            {
              input: 'IMP_SR_67',
              calcul: 'B/A'
            },
            {
              input: 'IMP_SR_68'
            }
          ]
        },
        {
          item: "SI.4(11)",
          question: ["Calculate DD/LOC and enter score.(total from all units)  \n  1-(TDD/SLOC)"],
          check: [
            {
              input: 'IMP_SR_69',
              calcul: '1-(TDD/SLOC)'
            }
          ]
        },
        {
          item: "SI.4(12)",
          question: ["a.  For how many units does each data item have a single use(e.g., each array serves only one purpose)? \n a. 각data item은 하나의 목적으로만 사용되는가? (Yes인unit의수)", "b.   Calculate a/NM and enter score. \n b.   a/NM", "c.  If a/NM<1circle N, otherwise circle Y. \n c.  a/NM<1이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_70',
              calcul: 'A/NM<1'
            },
            {
              input: 'IMP_SR_71',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_72',
              no: 'IMP_SR_72',
              notapply: 'IMP_SR_72',
              unknown: 'IMP_SR_72'
            }
          ]
        },
        {
          item: "SI.4(13)",
          question: ["a.  How many units are coded according to the required programming standard? \n a. 해당Unit은요구하는프로그래밍standard에 따라 코딩 되었는가? (Yes인unit의수)", "b.   Calculate a/NM and enter score. \n b.   a/NM", "c.  If a/NM=<0.5circle N, otherwise circle Y. \n c.  a/NM<=0.5이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_73',
              calcul: 'A/NM<=0.5'
            },
            {
              input: 'IMP_SR_74',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_75',
              no: 'IMP_SR_75',
              notapply: 'IMP_SR_75',
              unknown: 'IMP_SR_75'
            }
          ]
        },
        {
          item: "SI.4(14)",
          question: ["Is repeated and redundant code avoided (e.g., through utilizing macros, procedures and functions)? \n 반복 및 중복되는code는 없는가?(함수나macro등으로 같은 코드를 반복해서 쓰는 것을 피하였는가?)"],
          check: [
            {
              yes: 'IMP_SR_76',
              no: 'IMP_SR_76',
              notapply: 'IMP_SR_76',
              unknown: 'IMP_SR_76'
            }
          ]
        },
        {
          item: "SI.5(1)",
          question: ["a.  How many data items are used as input?(total from all units) \n a. 몇개의data item이input으로 사용되는가?(전체unit의합)", "b.   Calculate1/(1+a)and enter score. \n b.  1/(1+a)"],
          check: [
            {
              input: 'IMP_SR_77',
              calcul: '1/(1+A)'
            },
            {
              input: 'IMP_SR_78'
            }
          ]
        },
        {
          item: "SI.5(2)",
          question: ["a.  How many data items are used as output(total from all units)? \n a.  몇개의data item이output으로 사용되는가?(전체unit의합)", "b.   How many parameters in the units calling sequence return output values(total from all units)? \n b.   해당unit의calling sequence에서 사용되는 parameter중 output값을 return하기위해 사용되는parameter는 몇 개 인가?(전체unit의합)", "c. If b/a =< 0.5 circle N, otherwise circle Y. \n c. b/a<=0.5이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_79',
              calcul: 'B/A<=0.5'
            },
            {
              input: 'IMP_SR_80',
              calcul: 'B/A<=0.5'
            },
            {
              yes: 'IMP_SR_81',
              no: 'IMP_SR_81',
              notapply: 'IMP_SR_81',
              unknown: 'IMP_SR_81'
            }
          ]
        },
        {
          item: "SI.5(3)",
          question: ["a.   How many units perform a single, non-divisible function? \n a.  해당unit은 하나의 나눌 수 없는 기능을 수행하는가?(Yes인unit의수)", "b.   Calculate a/NM and enter score. \n b.   a/NM", "c.  If a/NM=<0.5 circle N, otherwise circle Y. \n c.  a/NM<=0.5이면No, 그렇지 않으면Yes"],
          check: [
            {
              input: 'IMP_SR_82',
              calcul: 'A/NM<=0.5'
            },
            {
              input: 'IMP_SR_83',
              calcul: 'A/NM'
            },
            {
              yes: 'IMP_SR_84',
              no: 'IMP_SR_84',
              notapply: 'IMP_SR_84',
              unknown: 'IMP_SR_84'
            }
          ]
        }
      ]
    }
  ]
}


export const IMP_RADC_MODAL_FIELD = [IMP_RADC_SLFactor, IMP_RADC_SMFactor, IMP_RADC_SXFactor, IMP_RADC_SRFactor]