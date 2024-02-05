import axios, { ResponseType } from 'axios';
import Cookies from 'js-cookie';

export const sendRequest = (
	method: string,
	uri: string,
	data: { [key: string]: any } | null = null,
	bonusHeaders = {},
	responseType: ResponseType = 'json'
) => {
	const url = 'http://127.0.0.1:8000/api/' + uri;
	const headers = {
		Authorization: `Bearer ${Cookies.get('token')}`,
		...bonusHeaders,
	};

	return axios({
		method,
		url,
		data,
		headers,
		responseType,
	});
};
