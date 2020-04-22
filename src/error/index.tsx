import * as React from "react";
import { Row, Col, Divider } from 'antd';


import NotFound from '../static/images/404.png';
import ErrorCss from './Error.css';

export interface ErrorProps {
    status?     : number;
    message?    : string;
}

export default (props: ErrorProps) => {
    return (
        <div className={ErrorCss.error}>
            <Row justify="start" align="middle" gutter={16}>
                <Col sm={8} className={ErrorCss.imageWrapper}>
                    <img src={NotFound} />
                </Col>
                <Col sm={14}>
                    TEXT
                </Col>
            </Row>
        </div>
    )
}