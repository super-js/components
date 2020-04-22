import * as React from "react";
import Breadcrumbs, {BreadcrumbsProps} from '../breadcrumbs';
import { Divider } from "antd";

import ContentCss from './Content.css';

export interface ContentProps {
    breadcrumbs?    : BreadcrumbsProps,
    children?       : JSX.Element | JSX.Element[] | string
}

function Content(props: ContentProps) {
    return (
        <div className={ContentCss.content}>
            {/*{props.breadcrumbs ? <Breadcrumbs {...props.breadcrumbs} /> : null}*/}
            {/*{props.breadcrumbs ? <Divider className={ContentCss.divider} /> : null}*/}
            {props.children}
        </div>
    )
}
export default Content;