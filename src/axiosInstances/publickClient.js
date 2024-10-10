import {BASE_URL} from '../config'
import axios from 'axios';


export const publickClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
