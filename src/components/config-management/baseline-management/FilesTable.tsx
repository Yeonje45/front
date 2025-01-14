import React from 'react'
import Swal from 'sweetalert2'

import Button from 'tailwindElement/Button';
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'

import { IBaselineManagementDetailModel, DownloadConfigurationFile } from "models/ConfigManagement"

interface FilesTableProps {
	selectedSidebarDetailData: IBaselineManagementDetailModel
}

const FilesTable = ({ selectedSidebarDetailData }: FilesTableProps) => {
  const handleDownload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = event.currentTarget;
    const confirm = await Swal.fire({
      title: '다운로드',
      text: '다운로드 하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '다운로드',
      cancelButtonText: '취소',
    });
    if (!confirm.isConfirmed) { return; }
    const res = await DownloadConfigurationFile(selectedSidebarDetailData.conf_base_detail_id, name);
    if (!res.success) {
      Swal.fire({
        title: '다운로드 실패',
        text: res.message,
        icon: 'error',
      });
      return
    }
    Swal.fire({
      title: '다운로드 성공',
      text: '다운로드가 완료되었습니다.',
      icon: 'success',
    });
    return
 }
	  
	return (
		<PanelContainer>
			<PanelHeader>형상 변경 요청서</PanelHeader>
			<PanelBody className="max-h-[300px] min-h-[150px] overflow-y-auto">
				<table className="table w-full table-border">
					{ selectedSidebarDetailData.config_request_file && <tr>
					  <th>형상변경 요청서</th>
					  <td>
					    {selectedSidebarDetailData.config_request_file}
					  </td>
					  <td>
					    <Button name="config_request_file" onClick={handleDownload} >다운로드</Button>
					  </td>
					</tr> }
					{ selectedSidebarDetailData.change_details_file && <tr>
					  <th>변경사항 세부내역</th>
					  <td>
					    {selectedSidebarDetailData.change_details_file}
					  </td>
					  <td>
					    <Button name="change_details_file" onClick={handleDownload}>다운로드</Button>
					  </td>
					</tr> }
					{ selectedSidebarDetailData.ccb_file && <tr>
					  <th>CCB</th>
					  <td>
					    {selectedSidebarDetailData.ccb_file}
					  </td>
					  <td>
					    <Button name="ccb_file" onClick={handleDownload}>다운로드</Button>
					  </td>
					</tr> }
				</table>
			</PanelBody>
		</PanelContainer>
	)
}

export default FilesTable
