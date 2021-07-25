import axios from "axios"
import store from "../redux/store";

axios.defaults.baseURL = 'http://localhost:3000';
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    store.dispatch({
        type:"change-loading",value:true
    })
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
axios.interceptors.response.use(function (response) {
    // Do something with response data
    store.dispatch({
        type:"change-loading",value:false
    })
    return response;
  }, function (error) {
    store.dispatch({
        type:"change-loading",value:false
    })
    return Promise.reject(error);
  });