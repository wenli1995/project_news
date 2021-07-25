import React, { useEffect, useState } from 'react'
import axios from "axios"
import {Button,notification} from "antd"
import NewsPublish from '../../../../components/publish-manage/NewsPublish';
export default function UnPublished(){
    const [newsData,setNewsData] = useState([]);
    const {username}=JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=1&_expand=category`).then(res=>{
                //setDataSource(res.data);
                console.log("111",res)
                setNewsData(res.data);
        })
    }, [username]);
    const handlePublish=(item)=>{
        //过滤已发布的一条
        setNewsData(newsData.filter((data)=>data.id!==item.id))
        axios.patch(`/news/${item.id}`,{
            publishState:2,
            "publishTime":Date.now()
        }).then((res)=>{
            notification.success({
                message: `发布成功`,
                description:
                  `您可以在已发布菜单查看您的新闻`,
                placement:"bottomRight"
            });
        }) 
    }
    return (
        <div>
            {/* newsData变化属于属性变化，组件重新更新 */}
            <NewsPublish 
                dataSource={newsData} 
                button={(item)=><Button type="primary" onClick={()=>handlePublish(item)}>发布</Button>}
                /* 1、子元素传递item给父元素，需要父元素props传递一个方法；所以定义button是一个方法。
                   2、button方法中可以使用子元素传递的item
                   3、注意onClick回调中的回调函数需要接收item参数，所以携程箭头函数形式
                 */
            />
        </div>
           
    )
    
}
