import React, { Component } from 'react'
import { Form,Input,Button} from "antd"
import { message} from 'antd';
import axios from "axios";
import "./index.css"
import { UserOutlined, LockOutlined } from '@ant-design/icons';
export default class Login extends Component {
    onFinish=(values)=>{
        //console.log(values);
        axios.get(`/users?username=${values.username}&password\
        =${values.password}&roleState=true&_expand=role`).then(res=>{
            //_expand=role To include parent resource, add _expand是不需要带s的
            //console.log(res);
            if(res.data.length===1){
                //登录成功
                localStorage.setItem("user",JSON.stringify(res.data[0]))
                this.props.history.replace("/home");  //Login是路由组件有路由属性
            }else{
                //登录失败
                message.error('用户名或密码错误');;
            }
        })
    }
    render() {
        return (
            <div style={{ background: 'rgb(35, 39, 65)', height: "100%" }}>
                <div className="container">
                    <div className="loginTitle">新闻发布系统</div>
                    <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={this.onFinish}
                    >
                    <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
            
                    <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                    <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password"/>
                    </Form.Item>     
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
          </div>
        )
    }
}
