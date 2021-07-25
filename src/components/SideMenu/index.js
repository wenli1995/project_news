import React, { Component } from 'react'
import "./index.css"
import {Layout,Menu} from 'antd';
import {UserOutlined,HomeOutlined,BarsOutlined,CompressOutlined,SnippetsOutlined,PlusOutlined,FormOutlined,
    ClusterOutlined,EyeOutlined,FileSearchOutlined,NotificationOutlined,ExpandOutlined,FireOutlined,FrownOutlined} 
from '@ant-design/icons';
import { withRouter } from 'react-router';  
import axios from "axios";
//SideMenu是一个普通组件，为了控制路由条状，使用withRouter包裹
const {Sider} = Layout;
const { SubMenu } = Menu;
class SideMenu extends Component {
    state={
        menuList:[]
    }
    loginUser=JSON.parse(localStorage.getItem("user"))
    //icon列表是写死的，不会改变，所以不需要定义在state中
    iconList={
        "/home":<HomeOutlined />,
        "/user-manage":<UserOutlined />,
        "/user-manage/list":<BarsOutlined />,
        "/right-manage":<CompressOutlined />,
        "/right-manage/role/list":<BarsOutlined />,
        "/right-manage/right/list":<BarsOutlined />,
        "/news-manage":<SnippetsOutlined />,
        "/news-manage/add":<PlusOutlined />,
        "/news-manage/draft":<FormOutlined />,
        "/news-manage/category":<ClusterOutlined />,
        "/audit-manage":<EyeOutlined />,
        "/audit-manage/audit":<FileSearchOutlined />,
        "/audit-manage/list":<BarsOutlined />,
        "/publish-manage":<NotificationOutlined />,
        "/publish-manage/unpublished":<ExpandOutlined />,
        "/publish-manage/published":<FireOutlined />,
        "/publish-manage/sunset":<FrownOutlined />


    }
    componentDidMount(){
        axios.get("/rights?_embed=children").then(
            (res)=>{
                /* console.log(res); */
                this.setState({
                    menuList:res.data
                })
            }
        )
    }
/*     componentDidUpdate(){
        axios.get("/rights?_embed=children").then(
            (res)=>{
                this.setState({
                    menuList:res.data
                })
            }
        )
    } */
    checkPermission=(item)=>{
        return item.pagepermisson&this.loginUser.role.rights.includes(item.key)
        //登录用户有权限并且权限是页面权限
    }
    renderMenu=(menuList)=>{
        return (
            menuList.map((item)=>{
                if(!item.children||item.children.length===0){
                    if(this.checkPermission(item)){
                        return (
                            <Menu.Item key={item.key} icon={this.iconList[item.key]} onClick={()=>{this.props.history.push(item.key)}}>
                                {item.title}
                            </Menu.Item>
                        )
                    }
                    return null;

                }else{
                    //[]也判断为真
                    if(this.checkPermission(item)){
                        return (
                            <SubMenu key={item.key} icon={this.iconList[item.key]} title={item.title}>
                                {
                                    this.renderMenu(item.children)
                                }
                            </SubMenu>
                        )
                    }
                    return null;

                }
            })
        )
    }
    render() {
        return (
            <Sider trigger={null} collapsible collapsed={this.props.collapsed}> 
                <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
                    <div className="logo" style={{width:"100%",height:"auto"}}>新闻发布系统</div>
                    <Menu style={{flex:1,overflow:"auto"}} theme="dark" mode="inline" 
                    selectedKeys={[this.props.location.pathname]}
                    defaultOpenKeys={["/"+this.props.location.pathname.split("/")[1]]}>
                        {
                            this.renderMenu(this.state.menuList)
                        }
                    </Menu>
                    {/* defaultSelectedKeys:选中的菜单项，解决重定向不选中问题：selectedKeys
                        defaultOpenKeys:展开的菜单*/}
                </div>
          </Sider>
        )
    }
}

export default withRouter(SideMenu);