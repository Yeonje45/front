export const GetFileChecksum = async (file: File): Promise<string> => {
	const buffer = new TextEncoder().encode(await file.text());
	const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
	
	// ArrayBuffer를 16진수 문자열로 변환
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

	return hashHex;
}
