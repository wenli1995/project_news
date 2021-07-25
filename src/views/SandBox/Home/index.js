import React,{useEffect,useState} from 'react'
import { Card, Col, Row ,List,Avatar,Drawer} from 'antd';
import {Link} from "react-router-dom"
import axios from "axios";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import _ from 'lodash'  /* 这个库可以将axios返回的对象数组按指定字段分组 */
const { Meta } = Card;
export default function Home() {
    const [viewList,setViewList]=useState([])
    const [starList,setStarList]=useState([])
    const [visible, setVisible] = useState(false);  //控制抽屉的显示
    const [myNewsList,setMyNewsList]=useState([]);  //登录用户写的新闻分类
    const {username,region,role:{roleName}}=JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res=>{
            setViewList(res.data)
        })
        axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res=>{
            setStarList(res.data)
        })
    }, [])
    //获取柱状图新闻分类数据
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res=>{
            //console.log(_.groupBy(res.data,item=>item.category.title)) 
            /* 第二个参数是函数，指定分类规则 .此行代码将返回的数据按照分类进行分组划分,返回的是一个对象，key是分组的item.category.title，value是对象数组*/
            let obj=_.groupBy(res.data,item=>item.category.title);
            renderBarView(obj);
            setMyNewsList(res.data.filter((item)=>item.author===username));  //设置当前用户的新闻数据
        })
    }, [])
    //显示右侧抽屉
    const showDrawer=()=>{
        setVisible(true);
        renderPieView()
    }
    const hideDrawer=()=>{
        setVisible(false);
    }
    //渲染饼状图
    const renderPieView=()=>{
        console.log(myNewsList)
        let list=[]  /*饼状图初始化数据：格式 [{value: 1048, name: '搜索引擎'},{value: 735, name: '直接访问'},] */
        let obj=_.groupBy(myNewsList,item=>item.category.title);
        for(let i in obj){
            /* 遍历所有对象key */
            list.push({value:obj[i].length,name:i});
        }
        console.log(list);
        let chartDom = document.getElementById('pie'); /* 新闻分类:分类下的新闻条数 */
        let myChart = echarts.init(chartDom);
        let option;
        option = {
            title: {
                text: '当前用户新闻分类图示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '新闻分类',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        option && myChart.setOption(option);

    }
    //渲染柱状图
    const renderBarView=(obj)=>{
        let myChart = echarts.init(document.getElementById('bar'));
        const option = {
                title: {
                    text: '新闻分类图示'
                },
                tooltip: {},
                legend: {
                    data:['数量']
                },
                xAxis: {
                    /* 获取对象的所有key值 */
                    data: Object.keys(obj),
/*                     axisLabel:{
                        rotate:"45",
                        interval:0
                    } // 坐标轴名字旋转，角度值。  */
                },
                yAxis: {
                    minInterval: 1 /* Y轴配置，设置成1保证坐标轴分割刻度显示成整数 */
                },
                series: [{
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item=>item.length)
                    /* Object.values(obj),对象的值以数组形式返回 */
                }]
        };
        myChart.setOption(option);  //根据设置的内容渲染柱状图
    }
    return (
      <div>
        <div className="site-card-wrapper">
            <Row gutter={24}>
            <Col span={8}>
                <Card title="用户最常浏览" bordered>
                    <List
                        bordered
                        dataSource={viewList}
                        renderItem={item => (
                            <List.Item>
                                <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="用户点赞最多" bordered>
                    <List
                        bordered
                        dataSource={starList}
                        renderItem={item => (
                            <List.Item>
                                <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    cover={
                    <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                    }
                    actions={[
                        <SettingOutlined key="setting" onClick={()=>{setTimeout(()=>{
                            showDrawer();/* 异步调用使得抽屉现出来再初始化柱状图,否则会找不到控件 */
                        })}}/>,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                    ]}
                >
                    <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={username}
                    description={
                        <div>
                            <b>{region?region:"全球"}</b>&nbsp;
                            <span>{roleName}</span>
                        </div>
                    }
                    />
                 </Card>
            </Col>
            </Row>
        </div>
         {/* 渲染echart饼图的控件 */}
        <Drawer
            width="500px"
            title="Basic Drawer"
            placement="right"
            closable={true}
            onClose={hideDrawer}
            visible={visible}
            >
            <div id="pie" style={{width: '100%',height: "400px",marginTop: "30px"}}>
            </div>
        </Drawer>
         {/* 渲染echart柱状图的控件 */}
        <div id="bar" style={{width:'100%',height: "400px",marginTop: "30px"}}></div>      
      </div>
    )
}
