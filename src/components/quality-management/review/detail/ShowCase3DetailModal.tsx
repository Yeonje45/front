import React from "react"
import Swal from "sweetalert2"

import Input from "tailwindElement/Input"
import Button from "tailwindElement/Button"
import Modal from "tailwindElement/Modal"
import Tabs from "tailwindElement/Tabs"
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

import {
  GetTechnicalReviewCase3, ITechnicalReviewCase3Model,
  ITechnicalReviewCase3ReviewTarget, TechnicalReviewCase3ReviewTargetCategories,
  
} from 'models/QualityManagement';

interface IShowCase3DetailModalProps {
	project_id: string;
	selected_review_id: number | null
	disabled: boolean
}

const ShowCase3DetailModal = ({project_id, selected_review_id, disabled}: IShowCase3DetailModalProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  // 개요 탭
  const [overview, setOverview] = React.useState<ITechnicalReviewCase3Model | null>(null);
  // 검토 대상 및 진행 현황 탭
  const [targets, setTargets] = React.useState<ITechnicalReviewCase3ReviewTarget[] | null>(null);
  const [filterdTargets, setFilterdTargets] = React.useState<ITechnicalReviewCase3ReviewTarget[] | null>(null);
  const [selectedTargetCategory, setSelectedTargetCategory] = React.useState<string>("all");

  React.useEffect(() => {
    if (isOpen) {
      setSelectedTargetCategory(() => "all");
      handleGetCase3Overview();
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(() => true);
  };

  const handleClose = () => {
    setIsOpen(() => false);
  };

  // Case3 개요 탭 데이터 조회 
  const handleGetCase3Overview = async () => {
    if (!selected_review_id) { return };
    const res = await GetTechnicalReviewCase3({review_id: selected_review_id});
    if (!res.success) {
      Swal.fire({
        icon: "error",
        title: "에러",
        text: res.message || "데이터 조회 중 오류가 발생하였습니다.",
      });
      return;
    };
    setOverview(() => res.data || null);
    setTargets(() => res.data?.review_targets || null);
    setFilterdTargets(() => res.data?.review_targets || null);
  };

  // case3 검토 대상 카테고리 선택
  const handleSelectTargetCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!targets) { return }
    const { name } = event.currentTarget;
    setSelectedTargetCategory(() => name);
    if (name === "all") {
      setFilterdTargets(() => targets);
      return
    } 
    setFilterdTargets(() => targets.filter(target => target.peer_category === name));
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen} disabled={disabled}>상세보기</Button>

      <Modal isOpen={isOpen} size="lg">
        <Modal.Head>상세내용(SRR 검토결과 조치)</Modal.Head>
        <Modal.Body>
          <Tabs defaultTab="개요">

            { overview && 
              <Tabs.Tab label="개요">
                <div className="p-1.5 grid grid-cols-1 grid-flow-row gap-3">
                  {/* 구분 */}
                  <div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
                    <div className="lg:col-span-2">구분*</div>
                    <div className="lg:col-span-6">
                      <Input defaultValue="기술검토회의" disabled />
                    </div>
                  </div>
                  {/* 검토 이름 */}
                  <div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
                    <div className="lg:col-span-2">검토 이름*</div>
                    <div className="lg:col-span-6">
                      <Input defaultValue={overview.review_name} disabled />
                    </div>
                  </div>
                  {/* 검토 설명 */}
                  <div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
                    <div className="lg:col-span-2">검토 설명</div>
                    <div className="lg:col-span-6">
                      <Input defaultValue={overview.review_description} disabled />
                    </div>
                  </div>
                  {/* 시작 예정일 */}
                  <div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
                    <div className="grid grid-cols-8 col-span-8">
                      <div className="lg:col-span-2">시작 예정일</div>
                      <Input className="lg:col-span-6" type="date" defaultValue={new Date(overview.review_start_date).toISOString().split('T')[0]} disabled/>
                    </div>
                    <div className="grid grid-cols-8 col-span-8">
                      <div className="lg:col-span-2">종료 예정일</div>
                      <Input className="lg:col-span-6" type="date" defaultValue={new Date(overview.review_end_date).toISOString().split('T')[0]} disabled/>
                    </div>
                  </div>
                </div>
              </Tabs.Tab> 
            }

            { targets && targets.length !== 0 && 
              <Tabs.Tab label="검토 대상 및 진행 현황">
                <div className="grid grid-flow-row lg:grid-cols-8">
                  <div className="lg:col-span-2 overflow-x-auto">
                    <PanelContainer>
                      <PanelHeader title="목차" />
                      <div className="max-h-[400px] overflow-y-auto">
                        {
                          TechnicalReviewCase3ReviewTargetCategories.map((category, index) => (
                            <Button 
                              key={index} 
                              name={category.key} 
                              variant={selectedTargetCategory === category.key ? "secondary" : "unset"}
                              className="w-full rounded-none p-3 border"
                              onClick={handleSelectTargetCategory}>
                              {category.name}
                            </Button>
                          ))
                        }
                      </div>
                    </PanelContainer>
                  </div>

                  <div className="lg:col-span-6 overflow-x-auto">
                    <PanelContainer>
                      <PanelHeader title="상세 데이터" />
                      <PanelBody className="space-y-3 max-h-[400px] overflow-y-auto">
                        <div className="overflow-x-auto">
                          <table className="w-full table table-border">
                            <thead className="whitespace-nowrap">
                              <tr>
                                <th>선택</th>
                                <th>검토 순서</th>
                                <th>식별자 및 장절</th>
                                <th>제목</th>
                                <th>상태</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                filterdTargets?.map((target, index) => (
                                  <tr key={index}>
                                    <td>
                                      <input type="checkbox" />
                                    </td>
                                    <td>{target.review_order}</td>
                                    <td>{target.review_target_content}</td>
                                    <td>{target.review_target_name}</td>
                                    <td>
                                      { target.review_target_states && <div>
                                        {
                                          target.review_target_states.map((state) => (
                                            <div key={state.review_participant_id}>
                                              {state.participant_user_id} : {state.review_state}
                                            </div>
                                          ))
                                        }
                                      </div> }
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                      </PanelBody>
                    </PanelContainer>
                  </div>
                </div>
              </Tabs.Tab> 
            }

          </Tabs>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default ShowCase3DetailModal;
