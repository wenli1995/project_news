import React, { Component } from 'react'
import './App.css'
import IndexRouter from './router'
import "./util/http.js"
import store from "./redux/store"
import {Provider} from 'react-redux'
export default class App extends Component {
  render() {
    /* Provider 注入Store */
    return (
      <Provider store={store}>
        <IndexRouter></IndexRouter>
        </Provider>
      /* APP中引入路由组件 */
      
    )
  }
}
