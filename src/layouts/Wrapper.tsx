import * as React from "react";
import cx from 'classnames';
import { Layout } from "antd";

import WrapperCss from './Wrapper.css';

export interface IWrapperProps {
    children?       : JSX.Element | JSX.Element[]
}

export default function Wrapper(props: IWrapperProps) {

    const [
        header, content, footer
    ] = Array.isArray(props.children) ? props.children : [undefined, props.children, undefined];

    return (
        <Layout className={WrapperCss.wrapper}>
            {header ? (
                <Layout.Header className={WrapperCss.wrapperHeader}>
                    {header}
                </Layout.Header>
            ) : null}
            <Layout.Content className={cx(WrapperCss.wrapperContent, {
                [WrapperCss.hasFooter] : !!footer
            })}>
                <div className={WrapperCss.wrapperContentBody}>
                    {content ? content : null}
                </div>
            </Layout.Content>
            {footer ? (
                <Layout.Footer className={WrapperCss.wrapperFooter}>
                    {footer}
                </Layout.Footer>
            ) : null}
        </Layout>
    )
}