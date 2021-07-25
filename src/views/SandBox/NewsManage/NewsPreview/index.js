import React,{useState,useEffect} from 'react'
import { PageHeader,  Descriptions} from 'antd';
import axios from 'axios';
import moment from 'moment';  //日期转换
export default function NewsPreview(props) {
    const [newsDetail,setNewsDetail]=useState([]);
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category`).then((res)=>{
            console.log(res.data)
            setNewsDetail(res.data);
        })
    }, [props.match.params.id])
    //审核状态字典
    const auditList = ["未审核", '审核中', '已通过', '未通过']
    //发布状态字典
    const publishList = ["未发布", '待发布', '已上线', '已下线']
    return (
        <div>
            {/* 获取路由传递的params参数 */}
           <PageHeader
                onBack={() => props.history.goBack()}
                title={newsDetail.title}
                subTitle={newsDetail.category?.title}>
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsDetail.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{moment(newsDetail.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsDetail.publishTime?moment(newsDetail.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsDetail.region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态">{auditList[newsDetail.auditState]}</Descriptions.Item>
                    <Descriptions.Item label="发布状态">{publishList[newsDetail.publishState]}</Descriptions.Item>
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
