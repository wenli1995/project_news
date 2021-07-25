import React, { Component } from 'react'
import { Layout, Menu,Dropdown,Avatar} from 'antd';
import {MenuUnfoldOutlined,MenuFoldOutlined,UserOutlined} from '@ant-design/icons';
import {withRouter} from "react-router-dom"
const { Header} = Layout;
class TopHeader extends Component {
    loginUser=JSON.parse(localStorage.getItem("user"))
    menu = (
        <Menu>
          <Menu.Item key="1">
                {this.loginUser.role.roleName}
          </Menu.Item>
          <Menu.Item  key="2" danger onClick={()=>{
              //localStorage清除token
              localStorage.removeItem("user")
              //console.log(this.props) withRouter使得该组件可以操作路由
              this.props.history.replace("/login")
          }}>
              退出
          </Menu.Item>
        </Menu>
      );
    render() {
        //console.log(this.loginUser)
        return (
            <Header className="site-layout-background" style={{ padding: 0 }}>
                {React.createElement(this.props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.props.toggle,
                })}
                <div style={{float:"right",marginRight:"24px"}}>
                    <span>欢迎你，<span style={{color:"#1890ff"}}>{this.loginUser.username}</span></span>
                    <Dropdown overlay={this.menu}>
                        <Avatar size={32} icon={<UserOutlined />} />
                    </Dropdown>
                </div>
            </Header>
        )
    }
}
export default withRouter(TopHeader)
