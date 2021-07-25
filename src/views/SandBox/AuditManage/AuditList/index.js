import React, { useState,useEffect } from 'react'
import {Table,Tag,Button,notification} from "antd"
import {Link} from "react-router-dom"
import axios from 'axios';
export default function AuditList(props) {
    const [dataSource,setDataSource]=useState([]);
    const {username}=JSON.parse(localStorage.getItem("user")) 
    useEffect(() => {
        /* 获取列表数据，用户自己创建的审核状态不为0，发布状态未发布、待发布的新闻 */
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res=>{
            setDataSource(res.data);
        })
        
    }, [username])
    const columns=[
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
            title: '审核状态',
            dataIndex: 'auditState',
            render:(auditState)=>{
                const colorList = ['','orange','green','red']
                const auditList = ["草稿","审核中","已通过","未通过"] 
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
          },
          {
              title: '操作',
              /* 没有dataIndex，则传入render方法的参数就是item本身 */
              render:(item)=>{
                return (
                <div>
                    {
                        item.auditState===1&&<Button default onClick={()=>handleCancel(item)}>撤回</Button>
                    }
                    {
                        item.auditState===2&&<Button danger onClick={()=>handlePublish(item)}>发布</Button>
                    }{
                        item.auditState===3&&<Button type="primary" onClick={()=>handleUpdate(item)}>更新</Button>
                    }
                </div>)
              }
          }
    ]
    //审核中状态支持撤回：审核状态由1（审核中）变为0回到草稿箱
    const handleCancel=(item)=>{
        axios.patch(`/news/${item.id}`,{
            auditState:0
        }).then(res=>{
            props.history.push("/news-manage/draft");
            notification.success({
              message: '撤回成功',
              description:
                '您可以到草稿箱中查看您的新闻',
              placement:"bottomRight"
          });
        })        
    }
    //审核通过状态支持发布：审核状态保持为2（审核通过），发布状态变为已发布(2)
    const handlePublish=(item)=>{
        axios.patch(`/news/${item.id}`,{
            publishState:2,
            publishTime:Date.now()
        }).then((res)=>{
            //路由跳转到已发布页面
            props.history.push("/publish-manage/unpublished");
            notification.success({
                message: '发布成功',
                description:
                    '您可以到待发布列表中查看您的新闻',
                placement:"bottomRight"
        });
        })
    }
    //审核未通过状态支持更新：跳转到新闻更新页面
    const handleUpdate=(item)=>{
        props.history.push(`/news-manage/update/${item.id}`)
    }
    return (
         <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}/>
    )
}
