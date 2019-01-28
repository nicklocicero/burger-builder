import axios from 'axios';

const instance = axios.create({
  baseURL: "https://react-my-burger-7004f.firebaseio.com/"
})

export default instance;