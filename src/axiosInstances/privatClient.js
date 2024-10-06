import {BASE_URL} from '../config'
import Cookies from 'js-cookie'
import axios from 'axios';


const accessToken = Cookies.get('accessToken')
export const privatClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Token ${accessToken}`
  },
});
