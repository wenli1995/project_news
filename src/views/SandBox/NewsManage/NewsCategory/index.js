import React, { useState,useEffect,useRef } from 'react'
import {Table,Button,Modal,Form,Input} from "antd"
import {DeleteOutlined,ExclamationCircleOutlined,EditOutlined} from '@ant-design/icons';
import axios from "axios"
const { confirm } = Modal;
export default function NewsCategory() {
    const [dataSource,setDataSource]=useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentItem,setCurrentItem]= useState({});  //当前更新的新闻
    useEffect(() => {
        axios.get(`/categories`).then(res=>{
            setDataSource(res.data)
        })
    }, [])
    const columns=[
        {
            title: 'ID',
            dataIndex: 'id',
          },
          {
            title: '新闻分类',
            dataIndex: 'title',
          },
          {
              title: '操作',
              /* 没有dataIndex，则传入render方法的参数就是item本身 */
              render:(item)=>{
                return (
                <div>
                      <Button type="danger" shape="circle" icon={<DeleteOutlined/>} onClick={()=>showConfirm(item)}/>&nbsp;
                      <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>showEditModal(item)}/>
                </div>)
              }
          }

    ]
    //弹出删除二次确认弹窗
    const showConfirm=(item)=>{
        confirm({
            title: '确定要删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk:()=>{
                deleteItem(item);
            },
            onCancel() {
                console.log('Cancel');
            },
            });
    }
    //点击确认触发删除动作
    const deleteItem=(item)=>{
        setDataSource(dataSource.filter((data)=>data.id!==item.id))
        axios.delete(`/categories/${item.id}`)
    }
    const showEditModal=(item)=>{
        setIsModalVisible(true);
        setCurrentItem(item)
    }
    const fromRef = useRef();
    const editItem=()=>{
        fromRef.current.validateFields().then(value=>{
            setIsModalVisible(false); //点击确定触发表单校验再关闭
            fromRef.current.resetFields()
            //更新时由于已经可以获取到id值，所以可以先更新状态再发送请求。
            let list=dataSource.map(data=>{
              //找到需要修改的项目,修改
              if(data.id===currentItem.id){
                return {...data,...value}
              }else{
                return data
              }
            })
            setDataSource(list);
            axios.patch(`/categories/${currentItem.id}`,value)
          })
        
    }
    return (
        <div>
           <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}/>
           <Modal
              visible={isModalVisible}
              title="修改新闻分类"
              okText="确定"
              cancelText="取消"
              onCancel={()=>{
                setIsModalVisible(false);
              }}
              onOk={editItem}>
                <Form
                    ref={fromRef}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    >
                    <Form.Item
                        label="新闻分类"
                        name="title"
                        rules={[{ required: true, message: '请输入新闻分类' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
