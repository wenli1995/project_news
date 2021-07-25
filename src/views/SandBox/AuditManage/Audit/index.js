import React,{useEffect, useState} from 'react'
import axios from "axios"
import {Table,Button,notification} from "antd"
import {Link} from "react-router-dom"
export default function Audit() {
    const [dataSource,setDataSource]=useState([]);
    const {roleId,region,username}  = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
        /* 获取待审核数据，本人审核的，超级管理员和预取管理员看到的不同 */
        axios.get(`/news?auditState=1&_expand=category`).then(res=>{
            let data=res.data
            if(roleId===1){
                setDataSource(data)
              }else{
                setDataSource([...data.filter(item=>item.author===username),
                    ...data.filter(item=>item.roleId===3&&item.region===region)])
              }
        })
        
    }, [roleId,region,username])  /* 直接监听loginUser会导致redux的状态监控出问题 */
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
              title: '操作',
              /* 没有dataIndex，则传入render方法的参数就是item本身 */
              render:(item)=>{
                return (
                <div>
                    <Button  onClick={()=>handleAudit(item,3,0)}>驳回</Button>&nbsp;
                    <Button  type="primary" onClick={()=>handleAudit(item,2,1)}>通过</Button>
                </div>)
              }
          }
    ]
    //驳回:审核状态3（未通过），发布状态0（未发布）
    //通过:审核状态2，发布状态1（待发布）
    const handleAudit=(item,auditState,publishState)=>{
        axios.patch(`news/${item.id}`,{
            auditState,
            publishState
        }).then((res)=>{
            notification.success({
                message: '操作成功',
                description:
                  '您可以到审核列表查看您的新闻的审核状态',
                placement:"bottomRight"
            });
        })
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}/>
        </div>
    )
}
