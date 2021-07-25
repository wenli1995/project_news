import React,{useState,useEffect,useRef} from 'react'
import { Steps ,PageHeader,Button,message,Form,Input,Select,notification} from 'antd';
import axios from "axios"
import NewsEditor from '../../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const { Option } = Select;
export default function NewsUpdate(props) {
    const [current,setCurrent]=useState(0);
    const [category,setCategory]=useState([]);
    const [content,setContent]=useState('');
    const [newsInfo,setNewsInfo]=useState({});
    useEffect(() => {
        axios.get("/categories").then((res)=>{
            setCategory(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category`).then((res)=>{
            //设置step1表单获得表单内容
            //console.log(res.data)
            const {title,categoryId,content}=res.data
            formRef.current.setFieldsValue({title,categoryId})  
            //设置step2的富文本编辑器获得内容：props down传递
            setContent(content);
            
        })
    }, [props.match.params.id])
    const formRef=useRef()
    const prev=()=>{
        setCurrent(current-1)
    }
    const next=()=>{
        if(current===0){
            //console.log(formRef.current)
            formRef.current.validateFields()
            .then(values => {
                setNewsInfo(values);
                setCurrent(current+1)
            }).catch(err=>{
                console.log(err);
            })
        }else if(current===1){
            //校验新闻内容不能为空
            if(content===""||content.trim()==="<p></p>"){
                message.error("新闻内容不能为空")
            }else{
                setCurrent(current+1)
            } 
        }else{
            setCurrent(current+1)
        }

    }
    //提交草稿箱和提交用同一个方法，传入不同审核参数
    const handleSave=(auditState)=>{
        axios.patch(`/news/${props.match.params.id}`,{
            ...newsInfo,
            "content":content,
            "auditState": auditState, /* 未审核，草稿 */
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            /* "publishTime":  */
        }).then((res)=>{
            console.log(res)
            notification.success(
                auditState===0?{
                    message: '保存成功',
                    description:'您可以在草稿箱查看已保存新闻',
                    placement:"bottomRight"
                }:{
                    message: '提交成功',
                    description:'您可以在审核列表查看已提交新闻',
                    placement:"bottomRight"
                });
            props.history.push(auditState===0?"/news-manage/draft":"/audit-manage/list")
        })
    }
    return (
        <div>
            <PageHeader
                title="更新新闻"
                subTitle="按以下步骤提示更新新闻"
                onBack={() => props.history.goBack()}
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>
            <div className={current===0?"steps-action":"content-hidden"}>
                <Form
                ref={formRef}
                name="basic"
                labelCol={{ span: 2 }}
                wrapperCol={{ span:10 }}
                initialValues={{ remember: true }}
                >
                    <Form.Item
                        label="新闻标题"
                        name="title"
                        rules={[{ required: true, message: '请输入标题!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="新闻分类"
                        name="categoryId"
                        rules={[{ required: true, message: '请输入新闻分类' }]}
                    >
                        <Select>
                            {
                                category.map(item=><Option value={item.id} key={item.id}>{item.title}</Option>)
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            <div className={current===1?"steps-action":"content-hidden"}>
                <NewsEditor getNewsContent={(value)=>{
                    setContent(value);
                    console.log(value);
                }} content={content}/>
            </div>
            <div className={current===2?"steps-action":"content-hidden"}>
                <Button type="primary" onClick={()=>handleSave(1)}>
                    提交审核
                </Button>&nbsp;
                <Button type="default" onClick={()=>handleSave(0)}>
                    保存草稿
                </Button>
            </div>
            <div className="steps-action">
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        上一步
                    </Button>
                )}
                {current < 2 && (
                    <Button type="primary" onClick={() => next()}>
                        下一步
                    </Button>
                )}
            </div>
        </div>
    )
}
