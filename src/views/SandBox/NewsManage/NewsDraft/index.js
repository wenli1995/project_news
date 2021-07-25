import React,{useEffect, useState} from 'react'
import {Table,Button,Modal,notification} from "antd"
import {DeleteOutlined,EditOutlined,UploadOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import axios from "axios";
import {Link} from "react-router-dom"
const { confirm } = Modal;
export default function NewsDraft(props) {
    const [dataSource,setDataSource]=useState([]);
    const {username}=JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`)
        .then((res)=>{
            setDataSource(res.data)
        })  
    }, [username])
    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: '新闻标题',
          dataIndex: 'title',
          render:(title,item)=>{
            /* 以params方式传参 */
            return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
          }
        },
        {
          title: '作者',
          dataIndex: 'author',
        },
        {
          title: '分类',
          dataIndex: 'category',
          render:(category)=>{
              return category.title
          }
        },
        {
            title: '操作',
            /* 没有dataIndex，则传入render方法的参数就是item本身 */
            render:(item)=>{
              return (
              <div>
                    <Button type="danger" shape="circle" icon={<DeleteOutlined/>} onClick={()=>showConfirm(item)}/>&nbsp;
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{props.history.push(`/news-manage/update/${item.id}`)}}/>
                    <Button type="primary" shape="circle" icon={<UploadOutlined onClick={()=>handleChecked(item)}/>} />
              </div>)
            }
        }
      ];
    //提交到待审核列表

    const handleChecked=(item)=>{
      axios.patch(`/news/${item.id}`,{
        auditState:1
      }).then((res)=>{
        props.history.push("/audit-manage/list");
        notification.success({
          message: '通知',
          description:
            '您可以到审核列表中查看您的新闻',
          placement:"bottomRight"
      });
      })
       
    }
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
        axios.delete(`/news/${item.id}`)
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}/>;
        </div>
    )
}

