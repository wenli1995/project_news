import React,{useState,useEffect} from 'react'
import {PageHeader, Card, Col, Row,List } from 'antd';
import _ from "lodash"
import axios from "axios"
import {Link} from "react-router-dom"
export default function News() {
    const [newsList,setNewsList]=useState([]);
    //按分类获取新闻数据
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res=>{
            //console.log(_.groupBy(res.data,item=>item.category.title)) 
            /* {科学技术: Array(3), 时事新闻: Array(1), 环球经济: Array(1), 军事世界: Array(3), 世界体育: Array(3), …}*/
            let obj=_.groupBy(res.data,item=>item.category.title);
            console.log(Object.entries(obj));/* 需要将数据转换城数组形式，一边渲染List */
            /* 输入结果：[ ["科学技术", Array(3)],["时事新闻", Array(1)]...] */
            setNewsList(Object.entries(obj));

        })
    }, [])
    return (
        <div style={{width:"95%", margin: '0 auto'}}>
            <PageHeader
                className="site-page-header"
                title="新闻板块"
                subTitle="家事国事天下事尽在眼前"
            />,
        
            <div className="site-card-wrapper">
                <Row gutter={[16,16]}>
                {/* 遍历数组["科学技术", Array(3)],["时事新闻", Array(1)]...]，渲染List */}
                {
                    newsList.map(data=>
                        <Col span={8} key={data[0]}>
                            <Card title={data[0]} bordered={true}>
                                <List
                                    size="small"
                                    pagination={{pageSize:3}}
                                    bordered
                                    dataSource={data[1]}
                                    renderItem={item => (
                                        <List.Item>
                                            <Link to={`/detial/${item.id}`}>{item.title}</Link>
                                        </List.Item>
                                    )}
                                />
                            </Card> 
                        </Col> 
                    )
                }
                    
                {/* 
                    <Col span={8}>
                        <Card title="Card title" bordered={true}>
                            <List
                                size="small"
                                pagination={{pageSize:3}}
                                bordered
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item>
                                     {item}
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col> 
                */}
                </Row>
            </div>
        </div>
    )
}
