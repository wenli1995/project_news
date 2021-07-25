import React,{useEffect, useState} from 'react'
import { EditorState, convertToRaw ,ContentState} from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
/* https://jpuri.github.io/react-draft-wysiwyg/#/docs */
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./index.css"
export default function NewsEditor(props) {
    const [editorState,setEditorState]=useState( EditorState.createEmpty())
    useEffect(() => {
        //更新新闻时，会传入props.content属性时html文本;创建新闻是没有传递的
        console.log(props.content);
        if(!props.content){
            return;
        }
        //html转换为editorState Raw形式
        const contentBlock = htmlToDraft(props.content);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
    }, [props.content])
    /*editorState, onEditorStateChange受控组件检测编辑区域内容变化 */
    return (
        <div>
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={(editorState)=>{setEditorState(editorState)}}
              onBlur={()=>{
                    //将转换为html的文本内容传递给父组件
                    props.getNewsContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }
            }
            />
        </div>
    )
}
