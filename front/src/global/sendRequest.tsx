import axios, { ResponseType } from 'axios';
import { ErrorData } from '../component/Home';
import Cookies from 'js-cookie';

export const sendRequest = (
  method: string,
  uri: string,
  data: { [key: string]: any } | FormData | null = null,
  bonusHeaders = {},
  responseType: ResponseType = 'json'
) => {
  const url = 'http://127.0.0.1:8000/api/' + uri;
  const headers = {
    Authorization: `Bearer ${Cookies.get('token')}`,
    ...bonusHeaders,
  };

  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      data,
      headers,
      responseType,
    })
      .then(response => {
        resolve(response.data); // Resolve with response data on success
      })
      .catch(error => {
        // Modify the error object to include response data
        if (error.response) {
          error.response.data = error.response.data || {}; // Ensure response.data exists
        }
        reject(error.response.data as ErrorData); // Reject with the modified error
      });
  });
};
