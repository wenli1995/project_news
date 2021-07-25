import React,{useEffect} from 'react'
import {Table}  from "antd"
import {Link} from "react-router-dom"
/* 待发布、已发布、已下线共用同一个组件，传入不一样的dataSource和Button */
export default function NewsPublish(props) {
/*     useEffect(() => {
        console.log('props',props);
    }, [props]) */
    useEffect(() => {
        console.log('zzzz',props);
    }, [props])
    const columns=[
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
            title: '新闻分类',
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
                            {/* 子元素传递给父元素item参数 */}
                            {props.button(item)}
                    </div>)
            }
        }
    ]
    return (
            <Table dataSource={props.dataSource} columns={columns} rowKey={(item)=>item.id}/>
    )
}
