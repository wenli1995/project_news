import React, { Component } from 'react'
import {Table,Button,Modal,Tree} from "antd"
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import axios from "axios"
const { confirm } = Modal;
export default class RoleManage extends Component {
    state={
        dataSource:[],  //保存角色数据 "id","roleName","roleType","rights"
        isModalVisible:false,
        treeData:[], //保存权限数据："id","title","key","pagepermisson","grade","children"
        currentRights:{id:'',rights:''}  //保存打开模态框的当前条目ID和当前权限
    }
    componentDidMount(){
        axios.get("/roles").then((res)=>{
            this.setState({
                dataSource:res.data
            })
        })   
        axios.get("/rights?_embed=children").then((res)=>{
            this.setState({
                treeData:res.data
            })
        }) 
    }
    columns = [
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: '角色名称',
          dataIndex: 'roleName',
        },
        {
            title: '操作',
            /* 没有dataIndex，则传入render方法的参数就是item本身 */
            render:(item)=>{
              return (
              <div>
                    <Button type="danger" shape="circle" icon={<DeleteOutlined/>} onClick={()=>this.showConfirm(item)}/>&nbsp;
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{this.showModal();this.setCurrentRights(item)}}/>
              </div>)
            }
        }
      ];
    //设置树形控件被选中的权限
    setCurrentRights=(item)=>{
        this.setState({
            currentRights:{id:item.id,rights:item.rights}
        },()=>{
            console.log(this.state.currentRights)
        })
        
    }
    //树形条目被点击时触发
    handleCheck=(checkedKeys)=>{
        //console.log(checkedKeys.checked)  //checkedKeys已选条目
        const {currentRights}=this.state
        this.setState({
            currentRights:{...currentRights,rights:checkedKeys.checked}  //这里一定注意，相同属性会被覆盖,引用类型currentRights:{rights:checkedKeys.checked} 会导致id属性消失了
        })
    }
    //控制模态框显示
    showModal=()=>{
        this.setState({
            isModalVisible:true
        })
    }
    //点击模态框确定按钮触发
    handleOk=()=>{
        const {dataSource,currentRights}=this.state;
        //修改对应角色的权限数据
        let roles=dataSource.map((item)=>{
            console.log("item",item.id,currentRights.id)
            if(item.id===currentRights.id){
                //修改该条目数据
                return {...item,rights:currentRights.rights}
            }
            return item;
        })
        this.setState({
            isModalVisible:false,
            dataSource:roles
        })
        axios.patch(`/roles/${currentRights.id}`,{rights:currentRights.rights});
    }
    //点击模态框取消按钮触发
    handleCancel=()=>{
        this.setState({
            isModalVisible:false
        })
    }
    //弹出删除二次确认弹窗
    showConfirm=(item)=>{
        confirm({
            title: '确定要删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk:()=>{
              this.deleteItem(item);
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }
    //点击确认触发删除动作
    deleteItem=(item)=>{
        this.setState({
            dataSource:this.state.dataSource.filter((data)=>data.id!==item.id)
        })
        axios.delete(`/roles/${item.id}`)
    }
    render() {
        return (
            <div>
                <Table dataSource={this.state.dataSource} columns={this.columns} rowKey={(item)=>item.id}/>;
                {/* rowKey:后台数据没有返回key时，可使用你这个属性定义key */}
                <Modal title="Basic Modal" visible={this.state.isModalVisible} onOk={this.handleOk}  onCancel={this.handleCancel}>
                        <Tree
                            checkable
                            checkedKeys={this.state.currentRights.rights}
                            treeData={this.state.treeData}
                            onCheck={this.handleCheck}
                            checkStrictly="true"
                        />
                        {/* defaultCheckedKeys写入被选中的条目的key
                        1、treeData在组件加载时而不是showMadal方法中初始化，否则这里使用defaultCheckedKeys会为空;
                        2、受控组件形式，将已选中数据保存在状态中
                        3、obCheck事件在复选框被点击时触发
                        为什么模态框不设置在table列的render中——会有比窘多初始化工作，逻辑太耦合
                         */}
                </Modal>
            </div>
        )
    }
}
