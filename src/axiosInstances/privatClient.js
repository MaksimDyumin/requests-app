import { BASE_URL } from '../config'
import Cookies from 'js-cookie'
import axios from 'axios';
import store from '@/store';


const accessToken = Cookies.get('Token')
export const privatClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Token ${accessToken}`
  },
});

privatClient.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get('Token')
    if (accessToken) {
      config.headers['Authorization'] = `Token ${accessToken}`
    }
    return config;
  },
  (error) => Promise.reject(error)
);

privatClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error?.config
    const accessToken = Cookies.get('Token')
    if (error?.response?.status === 403 && !config._retry && accessToken) {
      config._retry = true;
      Cookies.set('Token', null)
      store.commit('user/SET_AUTHORIZE', false)
    }
    return Promise.reject(error);
  }
)
