import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'tailwindElement/Button';
import ActiveLink from 'components/common/links/ActiveLink';

const ConfigurationIdentificationDocument = () => {
  const navigate = useNavigate();

	return (
		<section className="relative w-full h-full overflow-x-auto overflow-y-auto mam-h-500">

			{/* show element here */}
			<table className="table w-full table-border">
				<thead className="whitespace-nowrap">
					<tr>
						<th>구분</th>
						<th>시기</th>
						<th>등록 산출물</th>
						<th>산출물 등록</th>
						<th>베이스라인 등록</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>기능형상식별서</td>
						<td>체계기능검토회의(SFR)</td>
						<td>SSRS, SSDD</td>
						<td>
							<Button variant="primary" name="feature">
							  <ActiveLink to="/config-management/baseline-management?currentTarget=feature&">등록/조회</ActiveLink>
							</Button>
						</td>
						<td>기능기준선</td>
					</tr>
					<tr>
						<td>개발형상식별서</td>
						<td>SW상세설계검토회의(CDR)</td>
						<td>SRS, SDD, ICD</td>
						<td>
							<Button variant="primary" name="development">
							  <ActiveLink to="/config-management/baseline-management?currentTarget=development&">등록/조회</ActiveLink>
							</Button>
						</td>
						<td>개발기준선</td>
					</tr>
					<tr>
						<td>제품형상식별서</td>
						<td>DT 이후 PCA 이전</td>
						<td>SPS, SVD</td>
						<td>
							<Button variant="primary" name="product">
							  <ActiveLink to="/config-management/baseline-management?currentTarget=product&">등록/조회</ActiveLink>
							</Button>
						</td>
						<td>제품기준선</td>
					</tr>
				</tbody>
			</table>
		</section>
	)
}

export default ConfigurationIdentificationDocument;
