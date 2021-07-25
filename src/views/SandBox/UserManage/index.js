import React, { Component} from 'react'
import {Table,Button,Modal,Switch} from "antd"
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';
import axios from "axios";
const { confirm } = Modal;
export default class UserManage extends Component {
    state={
        dataSource: [],
        isAddModalVisible:false,
        isEditModalVisible:false,
        regionList:[],
        roleList:[],
        regionDisabled:false,  //控制编辑表单区域项的显示
        currentItem:{},  //当前更新的用户
    }
    columns = [
        {
          title: '区域',
          dataIndex: 'region',
          render:(region)=>{
              return <b>{region?region:"全球"}</b>
          },
          //指定该列支持筛选
          filters: [
            /* this.state.regionList不知为什么获取不到 */
            {text: "亚洲", value: "亚洲"},
            {text: "欧洲", value: "欧洲"},
            {text: "北美洲", value: "北美洲"},
            {text: "南美洲", value: "南美洲"},
            {text: "非洲", value: "非洲"},
            {text: "大洋洲", value: "大洋洲"},
            {text: "南极洲", value: "南极洲"},
            {text:"全球", value:"全球"}    

        ],
          onFilter: (value, item) => {
            if(value==="全球"){
              return item.region ===""
            }
            return item.region === value
          }
        },
        {
          title: '角色名称',
          dataIndex: 'role',
          render:(role)=>{
            return role?.roleName
          }
        },
        {
          title: '用户名',
          dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render:(roleState,item)=>{
                return <Switch checked={roleState} disabled={item.default} onChange={()=>this.swithChange(item)}/>
            }
          },
        {
            title: '操作',
            render:(item)=>{
              return (
              <div>
                    <Button type="danger" shape="circle" icon={<DeleteOutlined/>} onClick={()=>this.showConfirm(item)} disabled={item.default}/>&nbsp;
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>this.showEditModal(item)} disabled={item.default}/>
              </div>)
            }
          }
      ];
      formRef=React.createRef();  //指向添加用户表单
      editRef=React.createRef();  //指向编辑用户表单
      loginUser=JSON.parse(localStorage.getItem("user")); //用户信息读取好多次，放在redux中会比较好
      componentDidMount(){
        axios.get("/users?_expand=role").then((res)=>{
            let data=res.data;
            /* 对用户可见权限进行限制：
            超级管理员(roleId==1):可能见到所有用户
            区域管理员(roleId==2):见到本区域所有区域编辑
            区域编辑(roleId==3):没有查看用户列表的权限（不需要特殊处理）
             */
            if(this.loginUser.roleId===1){
              this.setState({dataSource:data});
            }else{
              this.setState({dataSource:[/* ...data.filter(item=>item.username===this.loginUser.username), */
                ...data.filter(item=>item.roleId===3&&item.region===this.loginUser.region)]});
            }
          }
        )
        axios.get("/regions").then((res)=>{
            let data=res.data;
            this.setState({regionList:data})}
        )   
        axios.get("/roles").then((res)=>{
          let data=res.data;
          this.setState({roleList:data})}
      )   
    }
/*     //状态更新后重新请求一边角色数据，否则获取不到角色名称.可以实现，但是也买你会重新渲染
    componentWillUpdate(){
        axios.get("/users?_expand=role").then((res)=>{
          let data=res.data;
          this.setState({dataSource:data})}
      )     
    } */
    setRegionDisabled=(value)=>{
      this.setState(
        {regionDisabled:value}
      )
    }
    //switch开关状态改变时触发
    swithChange=(item)=>{
      //item是引用类型，直接修改则dataSource的内容也已经修改
      item.roleState=!item.roleState;
      this.setState(
        {dataSource:[...this.state.dataSource]}
      )
      axios.patch(`/users/${item.id}`,{roleState:item.roleState})
    }
    showConfirm=(item)=>{
        confirm({
            title: '确定要删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk:()=>{
              //拷贝过来的onOk(){}方法里面的this是undefined,改写成箭头函数形式以操作state
              this.deleteItem(item);
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }
    //处理删除用户的请求
    deleteItem=(item)=>{
        //修改组件状态数据，状态监控是浅对比，修改引用型数据一定要注意
        this.setState({
            dataSource:this.state.dataSource.filter((data)=>data.id!==item.id)
        })
        axios.delete(`/users/${item.id}`)
    }
    //处理添加用户请求
    addUser=()=>{
      //console.log(this.formRef.current);
      this.formRef.current.validateFields().then((value)=>{
        this.setState({isAddModalVisible:false}) //点击确定触发表单校验再关闭
        this.formRef.current.resetFields()
        //console.log(res)  //{title: "1", password: "2", region: "非洲", roleId: 3}
        //这里先发送后台请求再设置状态，是因为id是后台自增的，先设置状态没有id值
        axios.post("/users",{
          ...value,
          "roleState": true,
          "default": false,
        }).then(res=>{
          console.log(res)
          this.setState(
            {
              dataSource:[
                ...this.state.dataSource,
                /* 新增元素刷新前获取不到角色名称问题 */
                {...res.data,
                  role:this.state.roleList.filter(item=>item.id===value.roleId)[0]}
              ],
            }
          )
        })
      }).catch((err)=>{
        console.log(err)
      })
    }
    //点击添加用户按钮弹出模态框
    showAddModal=()=>{
      this.setState({
        isAddModalVisible:true
      })
    }
    //点击编辑用户按钮弹出模态框
    showEditModal=(item)=>{
      this.setState({
        isEditModalVisible:true,
        regionDisabled:item.roleId===1?true:false,
        currentItem:item
      },()=>{
        this.editRef.current.setFieldsValue({...item}) 
      }) //异步更新回导致下一行代码获取this.editRef.current为null,所以需要回调函数
      //console.log(this.editRef) 
    }
    //处理编辑用户请求
    editUser=()=>{
      const {currentItem,dataSource,roleList}=this.state
      this.editRef.current.validateFields().then(value=>{
        //console.log(value); //{username: "西门吹灯", password: "123", region: "南极洲", roleId: 3}
        this.setState({isEditModalVisible:false}) //点击确定触发表单校验再关闭
        this.editRef.current.resetFields()
        //更新时由于已经可以获取到id值，所以可以先更新状态再发送请求。
        let users=dataSource.map(data=>{
          //找到需要修改的项目,修改
          if(data.id===currentItem.id){
            return {...data,...value,role:roleList.filter(item=>item.id===value.roleId)[0]}
          }else{
            return data
          }
        })
        this.setState({
          dataSource:users
        })
        axios.patch(`/users/${currentItem.id}`,value)
      })
    }
    render() {
        return (
          <div>
            <Button type="primary" onClick={this.showAddModal}>添加用户</Button>
            <Table columns={this.columns} dataSource={this.state.dataSource} pagination={{pageSize:10}} rowKey={(item)=>item.id}             />
            <Modal
              visible={this.state.isAddModalVisible}
              title="添加用户"
              okText="确定"
              cancelText="取消"
              onCancel={()=>{
                  this.setState({
                    isAddModalVisible:false
                })
              }}
              onOk={this.addUser}>
                <UserForm ref={this.formRef} 
                regionDisabled={this.state.regionDisabled} 
                setRegionDisabled={this.setRegionDisabled}
                regionList={this.state.regionList} 
                roleList={this.state.roleList}/>
            </Modal>
            <Modal
              visible={this.state.isEditModalVisible}
              title="编辑用户"
              okText="确定"
              cancelText="取消"
              onCancel={()=>{
                  this.setState({
                    isEditModalVisible:false
                })
              }}
              onOk={this.editUser}>
                <UserForm ref={this.editRef} 
                regionDisabled={this.state.regionDisabled} 
                setRegionDisabled={this.setRegionDisabled}
                regionList={this.state.regionList} roleList={this.state.roleList}/>
            </Modal>
            </div>
        )
    }
}
