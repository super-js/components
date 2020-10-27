import * as React from "react";

import ContentCss from './Content.css';

export interface ContentProps {
    children?       : JSX.Element | JSX.Element[] | string
}

function Content(props: ContentProps) {
    return (
        <div className={ContentCss.content}>
            {props.children}
        </div>
    )
}
export default Content;