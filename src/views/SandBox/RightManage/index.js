import React, { Component } from 'react'
import {Table,Tag,Button,Modal,Popover,Switch} from "antd"
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import axios from "axios";
const { confirm } = Modal;
export default class RightManage extends Component {
    state={
        dataSource: []
    }
    componentDidMount(){
        axios.get("/rights?_embed=children").then((res)=>{
            let data=res.data;
            //返回的首页数据children为[]，特殊处理下
            data.forEach(e => {
                if(e.children.length===0){
                    e.children='';
                }
            });
            this.setState({dataSource:data})})
    
    }
    //列是固定不随后端返回改变，不需写在状态中
    columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          render:(id)=>{
              return <b>{id}</b>
          }
        },
        {
          title: '权限名称',
          dataIndex: 'title'
        },
        {
          title: '权限路径',
          dataIndex: 'key',
          render:(key)=>{
            return <Tag color="blue">{key}</Tag>
          }
        },
        {
            title: '操作',
            /* 没有dataIndex，则传入render方法的参数就是item本身 */
            render:(item)=>{
              return (
              <div>
                    <Button type="danger" shape="circle" icon={<DeleteOutlined/>} onClick={()=>this.showConfirm(item)} />&nbsp;
                    <Popover 
                      content={<Switch checked={item.pagepermisson} onChange={()=>this.handleChange(item)}/>} 
                      title="配置页面权限" 
                      trigger={item.pagepermisson===undefined?"":"click"}>
                      <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson===undefined}/>
                    </Popover>
              </div>)
            }
          }
      ];
    //配置开关打开，菜单出现在左侧菜单树，否则不出现
    handleChange=(item)=>{
      //item是一个引用类型的数据，修改实际已影响dataSources本身
      item.pagepermisson = item.pagepermisson===1?0:1;
      this.setState({
        dataSource:[...this.state.dataSource]  //解构赋值千万不要搞成对象解构形式
      })
      console.log(this.state.dataSource)
      if(item.grade===1){
        axios.patch(`/rights/${item.id}`,{pagepermisson:item.pagepermisson})        
      }else{
        axios.patch(`/children/${item.id}`,{pagepermisson:item.pagepermisson})  
      }
    }
    showConfirm=(item)=>{
        confirm({
            title: '确定要删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk:()=>{
              //拷贝过来的onOk(){}方法里面的this是undefine,改写成箭头函数形式以操作state
              this.deleteItem(item);
              //console.log(item);
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }
    //处理删除权限的请求
    deleteItem=(item)=>{
        //二级列表项children：item:{id: 3, title: "添加用户", rightId: 2, key: "/user-manage/add", grade: 2}
        //一级列表项rights：item:{id: 1, title: "首页", key: "/home", pagepermisson: 1, grade: 1, children: Array(4)}
        //修改组件状态数据，状态监控是浅对比，修改引用型数据一定要注意
        if(item.grade===1){
            this.setState({
                dataSource:this.state.dataSource.filter((data)=>data.id!==item.id)
            })
            axios.delete(`/rights/${item.id}`)
        }else{
            //二级列表项所在的一级列表
            let rights=this.state.dataSource.filter((data)=>data.id===item.rightId);
            rights[0].children=rights[0].children.filter((data)=>data.id!==item.id);
            console.log(rights);  //截至这里，datasource内部数据（深层）发生了改变
            this.setState({
                dataSource:[...this.state.dataSource]
            })
            axios.delete(`/children/${item.id}`)
        }
    }
    render() {
        return (
          <div>
            <Table columns={this.columns} dataSource={this.state.dataSource} pagination={{pageSize:5}} />
            </div>
        )
    }
}
