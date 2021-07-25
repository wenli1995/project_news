import React,{useState,useEffect} from 'react'
import { PageHeader,  Descriptions} from 'antd';
import axios from 'axios';
import moment from 'moment';  //日期转换
import {HeartTwoTone} from '@ant-design/icons';
export default function Detail(props) {
    const [newsDetail,setNewsDetail]=useState([]);
    /* 访问量更新功能实现 */
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category`).then((res)=>{
            setNewsDetail(res.data);
            return res.data
            /*  then链式用法，下一个then是否执行取决于上一个then的结果，返回非promise对象都是成功，会执行下一个then，返回值就是下一个then的入参 */
        }).then((data)=>{
            /* console.log(res); */
            setNewsDetail({...data,view:data.view+1});
            axios.patch(`/news/${props.match.params.id}`,{view:data.view+1});
        })
    }, [props.match.params.id])
    const handleStar=()=>{
        setNewsDetail({...newsDetail,star:newsDetail.star+1});
        axios.patch(`/news/${props.match.params.id}`,{star:newsDetail.star+1});
    }
    return (
        <div>
            {/* 获取路由传递的params参数 */}
           <PageHeader
                onBack={() => props.history.goBack()}
                title={newsDetail.title}
                subTitle={
                    <div>
                        <span>{newsDetail.category?.title}</span>&nbsp;
                        <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar}/>
                    </div>
                }>
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsDetail.author}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsDetail.publishTime?moment(newsDetail.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsDetail.region}</Descriptions.Item>
                    <Descriptions.Item label="访问数量">{newsDetail.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{newsDetail.star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">0</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div dangerouslySetInnerHTML={{__html:newsDetail.content}} style={{
                        margin:"0 24px",
                        border:"1px solid #F1F1F1",
                        overflow:"auto"
                    }}>
                {/* 展示带有html标签的内容 */}
            </div>
        </div>
    )
}
