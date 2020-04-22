import * as React from "react";
import cx from 'classnames';

import SingleContentCss from './SingleContent.css';

export enum ESingleFormSize {
    Narrow  = "narrow",
    SuperNarrow = "supernarrow",
    Wide    = "wide"
}

export interface SingleFormProps {
    size?       : ESingleFormSize,
    children?   : JSX.Element | JSX.Element[]
}

function SingleContent(props: SingleFormProps) {

    return (
        <div className={cx(SingleContentCss.singleForm, {
            [SingleContentCss.superNarrow] : props.size === ESingleFormSize.SuperNarrow,
            [SingleContentCss.narrow] : props.size === ESingleFormSize.Narrow,
            [SingleContentCss.wide] : props.size === ESingleFormSize.Wide,
        })}>
            {props.children}
        </div>
    )
}

SingleContent.SuperNarrow = (props) => <SingleContent {...props} size={ESingleFormSize.SuperNarrow}/>;
SingleContent.Narrow = (props) => <SingleContent {...props} size={ESingleFormSize.Narrow}/>;
SingleContent.Wide = (props) => <SingleContent {...props} size={ESingleFormSize.Wide}/>;

export default SingleContent;