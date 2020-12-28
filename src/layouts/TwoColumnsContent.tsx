import * as React from "react";
import cx from 'classnames';
import {Row, Col} from "antd";

import TwoColumnsContentCss from './TwoColumnsContent.css';


export interface ITwoColumnsContentProps {
    children?: JSX.Element;
}

function TwoColumnsContent(props: ITwoColumnsContentProps) {

    return (
        <div className={cx(TwoColumnsContentCss.twoColumnsContentCss)}>
            {props.children}
        </div>
    )
}

export {TwoColumnsContent};