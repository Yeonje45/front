import { Cookies } from 'react-cookie'

/*
export default class Cookies {
    private cookies;
    private changeListeners;
    private HAS_DOCUMENT_COOKIE;
    constructor(cookies?: string | object | null, options?: CookieParseOptions);
    private _updateBrowserValues;
    private _emitChange;
    get(name: string, options?: CookieGetOptions): any;
    get<T>(name: string, options?: CookieGetOptions): T;
    getAll(options?: CookieGetOptions): any;
    getAll<T>(options?: CookieGetOptions): T;
    set(name: string, value: Cookie, options?: CookieSetOptions): void;
    remove(name: string, options?: CookieSetOptions): void;
    addChangeListener(callback: CookieChangeListener): void;
    removeChangeListener(callback: CookieChangeListener): void;
}
*/

const cookies = new Cookies()

// Set Cookie with expiration date
export const setCookie = (name: string, value: string) => {
	const expirationDate = new Date()
	expirationDate.setDate(expirationDate.getDate() + 1) // Set expiration to 1 day from now
	cookies.set(name, value, { expires: expirationDate, path: '/' })
}

// Get Cookie by name
export const getCookieByName = (name: string): string => {
	return cookies.get(name)
}

// Remove Cookie by name
export const removeCookie = (name: string) => {
	cookies.remove(name, { path: '/' })
}

// Delete User Cookie
export const deleteUserCookie = () => {
	removeCookie('access_token')
	removeCookie('user_id')
}
