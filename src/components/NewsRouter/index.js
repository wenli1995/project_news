import React, { Component } from 'react';
import {HashRouter,Redirect,Route,Switch} from "react-router-dom"
import {Spin} from 'antd';
import RoleManage from "../../views/SandBox/RoleManage"
import RightManage from "../../views/SandBox/RightManage"
import UserManage from "../../views/SandBox/UserManage"
import NoPermission from "../../views/SandBox/NoPermission"
import Home from "../../views/SandBox/Home"
import NewsAdd from "../../views/SandBox/NewsManage/NewsAdd"
import NewsCategory from "../../views/SandBox/NewsManage/NewsCategory"
import NewsDraft from "../../views/SandBox/NewsManage/NewsDraft"
import Audit from "../../views/SandBox/AuditManage/Audit"
import AuditList from '../../views/SandBox/AuditManage/AuditList';
import UnPublished from "../../views/SandBox/PublishManage/UnPublished"
import Published from '../../views/SandBox/PublishManage/Published';
import Sunset from "../../views/SandBox/PublishManage/Sunset"
import NewsPreview from "../../views/SandBox/NewsManage/NewsPreview"
import NewsUpdate from "../../views/SandBox/NewsManage/NewsUpdate"
import axios from "axios"
import {connect} from 'react-redux'
//路由映射表,根据登录用户角色渲染不一样的路由，防止用户通过url直接访问到页面数据
class NewsRouter extends Component {
    loginUser=JSON.parse(localStorage.getItem("user"));
    state={
        routeList:[]
    }
    routesMap={
        "/home":Home,
        "/user-manage/list":UserManage,
        "/right-manage/role/list":RoleManage,
        "/right-manage/right/list":RightManage,
        "/news-manage/add":NewsAdd,
        "/news-manage/draft":NewsDraft,
        "/news-manage/category":NewsCategory,
        "/audit-manage/audit":Audit,
        "/audit-manage/list":AuditList,
        "/publish-manage/unpublished":UnPublished,
        "/publish-manage/published":Published,
        "/publish-manage/sunset":Sunset,
        "/news-manage/preview/:id":NewsPreview,   /* 新闻预览，声明接收路由params参数，路由传参时传递params参数 */
        "/news-manage/update/:id":NewsUpdate   //新闻更新 
    }
    //同SlideMenu的菜单渲染的条件
    checkPermission=(item)=>{
        //console.log(this.loginUser)
        return (item.routepermisson||item.pagepermisson)&this.loginUser.role.rights.includes(item.key)
        //登录用户有权限并且权限是页面权限或者路由权限routepermisson，才允许展示
    }
    componentDidMount(){
        //拼接一维数组形式方便拼接
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then(
           //(res)=>console.log(res)  //一维数组，res[0]是第一个异步任务返回结果，res[1]是第二个
            (res)=>{
                let list=[...res[0].data,...res[1].data];
                this.setState({
                    routeList:list  //保存后台所有菜单路由的数据，有些要渲染到页面有些不用
                })
            }

        )

    }
    render() {
        return (
            <div>
                <HashRouter>
                {/*  <Switch>
                        <Route path="/home" component={Home}></Route>
                        <Route path="/user-manage/list" component={UserManage}></Route>
                        <Route path="/right-manage/role/list" component={RoleManage}></Route>
                        <Route path="/right-manage/right/list" component={RightManage}></Route>
                        <Redirect from="/" to="/home" exact/>
                        <Route path="*" component={NoPermission}></Route>
                    </Switch> */}
                    <Spin spinning={this.props.isLoading}>
                        {/* Spin在列表数据加载出来时显示loading ,
                        isLoading状态由redux管理，
                        在axios请求发送前置为true，请求发送后置为false
                        */}
                        <Switch>
                            {this.state.routeList.map((item)=>{
                                if(this.checkPermission(item)&&this.routesMap[item.key]){
                                    return <Route path={item.key} key={item.key} component={this.routesMap[item.key]}></Route>
                                }else{
                                    return null
                                }

                            })}
                            <Redirect from="/" to="/home" exact />
                            {
                                this.state.routeList.length>0 && <Route path="*" component={NoPermission} />
                            }
                        </Switch>
                    </Spin>
                    {/* 二级路由配置 */}
                </HashRouter>
            </div>
        );
    }
}
const mapStateToProps=(state)=>{
    return{
        /* 组件可以桶盖isLoading属性读取保存在redux的数值 */
        isLoading:state.isLoading
    }
}
//分发action由util/http.js文件分发控制
//react-redux包装组件
export default connect(mapStateToProps)(NewsRouter);