import * as React   from "react";
import cx           from "classnames";
import {Typography}       from "antd";

import {Icon} from "../icon";
import {AppCard}      from "../appcard";

import ProcessingCss from "./Processing.css";

export enum EProcessingSize {
    SMALL       = "SMALL",
    REGULAR     = "REGULAR",
    LARGE       = "LARGE"
}

export interface ProcessingProps {
    label?  : string;
    size?   : EProcessingSize;
    className?: string;
}

const Processing = (props: ProcessingProps) => {
    return (
        <div className={cx(ProcessingCss.processing, props.className, {
            [ProcessingCss.regularSize] : props.size === EProcessingSize.REGULAR,
            [ProcessingCss.largeSize] : props.size === EProcessingSize.LARGE,
        })}>
            <Icon iconName="spinner" spin />
            {props.label ? (
                <Typography>{props.label}</Typography>
            ) : null}
        </div>
    )
};

Processing.EProcessingSize = EProcessingSize;

Processing.WithAppCard = (props: ProcessingProps) => (
    <AppCard>
        <Processing {...props} />
    </AppCard>
);

export {Processing};