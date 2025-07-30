
import axios from '../utils/helpers/axiosconfig'
export const logOut = () => axios.post(`/api/logout/`);