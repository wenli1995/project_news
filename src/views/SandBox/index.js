import React, { Component } from 'react'
import { Layout} from 'antd';
import "./index.css"
import SideMenu from "../../components/SideMenu"
import TopHeader from "../../components/TopHeader"
import NewsRouter from '../../components/NewsRouter';
const {Content } = Layout;
class SandBox extends Component {
    state = {
        collapsed: false,
    };
    toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      }; 
    render() {
        return (
            <Layout>
                <SideMenu collapsed={this.state.collapsed}/>
                <Layout className="site-layout">
                    <TopHeader  toggle={this.toggle} collapsed={this.state.collapsed}/>
                    <Content className="site-layout-background" style={{margin: '24px 16px',padding: 24,minHeight: 280,overflow:'auto'}}>
                        <NewsRouter/>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}
export default SandBox;