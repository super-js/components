import * as React from "react";
import cx from 'classnames';
import { Layout } from "antd";

import WrapperCss from './Wrapper.css';

export interface IWrapperProps {
    footerContent?  : string | JSX.Element,
    children?       : JSX.Element | JSX.Element[]
}

export default function Wrapper(props: IWrapperProps) {

    const [
        header, content
    ] = Array.isArray(props.children) ? props.children : [undefined, props.children];

    return (
        <Layout className={WrapperCss.wrapper}>
            {header ? (
                <Layout.Header className={WrapperCss.wrapperHeader}>
                    {header}
                </Layout.Header>
            ) : null}
            <Layout.Content className={cx(WrapperCss.wrapperContent, {
                [WrapperCss.hasFooter] : props.footerContent
            })}>
                <div className={WrapperCss.wrapperContentBody}>
                    {content ? content : null}
                </div>
            </Layout.Content>
            {props.footerContent ? (
                <Layout.Footer className={WrapperCss.wrapperFooter}>
                    <div>
                        {props.footerContent}
                    </div>
                </Layout.Footer>
            ) : null}
        </Layout>
    )
}