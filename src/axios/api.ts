import axios from "axios";

const api = axios.create({
  //will be changed to const from .env later
  baseURL: "https://obscure-island-84086-0710166a71eb.herokuapp.com/api/v1/",
});

export default api;
