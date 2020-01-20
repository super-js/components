import * as React                           from "react";
import * as ReactDOM                        from "react-dom";
import {BrowserRouter as Router, Link, Switch, Route}      from "react-router-dom";

import {Layout, Menu, Icon}                     from "antd";
const {Header, Content, Footer, Sider}    = Layout;

//import '../node_modules/antd/dist/antd.css';

import DevelopmentForms             from './forms';

const DevelopmentApp = props => {
    return (
        <Router>
            <Layout>
                <Sider style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                }}>
                    <Menu theme="light" mode="inline">
                        <Menu.Item key="forms">
                            <Link to="/forms" className="nav-text">Forms</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ marginLeft: 200, minHeight: '100vh'}}>
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                        <div style={{ padding: 24, background: '#fff'}}>
                            <Switch>
                                <Route path="/forms">
                                    <DevelopmentForms />
                                </Route>
                            </Switch>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Antd Components ©2020</Footer>
                </Layout>
            </Layout>
        </Router>
    )
};

ReactDOM.render(<DevelopmentApp />, document.getElementById('app'));