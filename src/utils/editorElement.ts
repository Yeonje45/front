export const CreateSubmitElement = (tagContent: string, handleClick: () => Promise<void>) => {
	const EditorSubmitContainer = document.createElement('div');

	const submitBtnElement = document.createElement('span');
	submitBtnElement.textContent = tagContent;
	submitBtnElement.style.cursor = 'pointer';
	submitBtnElement.addEventListener('click', handleClick);

	EditorSubmitContainer.append(submitBtnElement);
	return EditorSubmitContainer;
}

export const CreateInputContainerElement = (inpId: string, handleChange: () => void) => {
	const EditorInpContainer = document.createElement('div');

	const label = document.createElement('label');
	label.style.margin = '0px 0px 10px 0px';
	label.style.padding = '5px';
	label.style.width = '100%';
	label.style.border = '1px solid #d9d9d9';
	label.style.cursor = 'pointer';
	label.textContent = '파일 업로드';
	label.htmlFor = inpId;

	const fileListWrapper = document.createElement('ul');

	const input = document.createElement('input');
	input.id = inpId
	input.type = 'file';
	input.accept = 'image/*';
	input.multiple = true;
	input.addEventListener('change', handleChange);
	input.addEventListener('change', () => {
		if (!input.files) return
		fileListWrapper.innerHTML = '';

		label.textContent = `파일 ${input.files.length}개 선택됨`
		for (let i = 0; i < input.files.length; i++) {
			if (!input.files[i]) return

			const li = document.createElement('li');
			li.style.margin = '5px 0px';
			li.textContent = input.files[i].name;

			// 미리보기 기능
			const sigleFile = input.files[i];
			li.addEventListener('click', async () => {
				if (!sigleFile) return
				const fakePath = URL.createObjectURL(sigleFile);
				const newWindow = window.open(fakePath, '_blank');
				if (newWindow) {
					newWindow.focus();
				}
			})
			fileListWrapper.append(li);
		}
	})
	EditorInpContainer.append(label, input, fileListWrapper);

	return EditorInpContainer
}
