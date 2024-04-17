import axios from 'axios';
import {useAppState} from "shared/states/useAppState";

export const API_URL = 'https://synthi-learn.online';

export const $api = axios.create({
  // withCredentials: true,
  baseURL: API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  },
});

$api.interceptors.request.use(config => {
  if (localStorage.getItem('accessToken')) {
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      'accessToken',
    )}`;
  }

  return config;
});

$api.interceptors.response.use(
  config => {
    return config;
  },
  async error => {
    const originalRequest = error.config;
    if (
      error.response?.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.post(
          `${API_URL}/entrypoint-service/v1/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
            },
          },
        );
        localStorage.setItem(
          'accessToken',
          response.data.resultData.accessToken,
        );
        localStorage.setItem(
          'refreshToken',
          response.data.resultData.refreshToken,
        );
        return $api.request(originalRequest);
      } catch (e) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        useAppState.getState().setIsAuth()
        console.log(e)
      }
    }
    throw error;
  },
);
