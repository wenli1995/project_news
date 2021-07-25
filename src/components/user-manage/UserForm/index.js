import React from 'react'
import {Form,Input,Select} from "antd"
const { Option } = Select
/* https://zh-hans.reactjs.org/docs/react-api.html#reactforwardref
React.forwardRef的使用，用于在高阶组件中转发 refs/转发 refs 到 DOM 组件。
React 会将 <UserForm ref={FormRef}> 元素的 ref 作为第二个参数传递给 React.forwardRef 函数中的渲染函数。
该渲染函数会将 ref 传递给Form组件，从而FormRef.current指向From组件,该组件有以下属性(antd官网的API)
setFieldsValue: ƒ (store)
validateFields: ƒ (nameList, options)
 */
const UserForm= React.forwardRef((props,ref)=>{
        const {region,roleId}=JSON.parse(localStorage.getItem("user"))  //region,roleId
        //控制角色选择超级管理员时区域不可输入,regionDisabled,交由父组件控制，方便添加和编辑表单共用
        return (
            <Form ref={ref} layout="vertical">
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },]}
              >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },]}
              >
              <Input />
            </Form.Item>
            <Form.Item
              name="region"
              label="区域"
              rules={props.regionDisabled?[]:[
                {
                  required: true,
                  message: '请输入区域',
                },]}
              >
              <Select  disabled={props.regionDisabled}>
                { 
                  //可选区域需要根据登录用户角色进行调整。超级管理员：所有;区域管理员：本区域
                  roleId===1?
                      props.regionList.map(item=><Option value={item.value} key={item.id}>{item.title}</Option>):
                      props.regionList.map((item)=>{
                        return <Option value={item.value} key={item.id} disabled={item.value!==region}>{item.title}</Option>
                      })

                }
              </Select>
            </Form.Item>
            <Form.Item
              name="roleId"
              label="角色"
              rules={[
                {
                  required: true,
                  message: '请输入角色',
                },]}
              >
              <Select onChange={(value)=>{
                  if(value===1){
                    props.setRegionDisabled(true); //区域不可输入
                    ref.current.setFieldsValue({
                      region:''
                    })
                  }else{
                    props.setRegionDisabled(false); //区域可输入
                  }
              }}>
                {
                  //可选区域需要根据登录用户角色进行调整。超级管理员：所有;区域管理员：区域管理员/区域编辑
                  roleId===1?
                    props.roleList.map(item=><Option value={item.id} key={item.id}>{item.roleName}</Option>):
                    props.roleList.map(item=><Option value={item.id} key={item.id} disabled={item.id<=roleId}>{item.roleName}</Option>)
                }
              </Select>
            </Form.Item>
          </Form>
        )
})
export default UserForm;