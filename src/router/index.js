import React, { Component} from 'react'
import Login from "../views/Login";
import SandBox from "../views/SandBox";
import News from "../views/news/News"
import Detial from "../views/news/Detail"
import {HashRouter,Redirect,Route,Switch} from "react-router-dom"
export default class IndexRouter extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/news" component={News}></Route>  {/* 前端系统的路由 */}
                    <Route path="/detial/:id" component={Detial}></Route>  {/* 前端系统的路由 */}
                    <Route path="/login" component={Login}></Route>
                    <Route path="/" render={()=>localStorage.getItem("user")?<SandBox/>:<Redirect to="/login"/>}></Route>
                </Switch>
            </HashRouter>
            /* 默认模糊匹配，/login也能匹配到/，所以使用switch,使得匹配到之后不继续寻找匹配 */
        )
    }
}
