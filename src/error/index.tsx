import * as React from "react";

import {Typography, Divider} from "antd";

import ErrorCss from './Error.css';
import {Icon} from "../icon";
import {AppCard} from "../appcard";
import {SingleContentPage} from "../pages";

export interface ErrorProps {
    title?      : string;
    status?     : number;
    message?    : JSX.Element;
}

const STATUS_ICONS = {
    500: <Icon iconName="sad-tear" />
}

function Error(props: ErrorProps) {

    const title     = props.title || (props.status === 404 ? "Page not found" : "Oops, something went wrong");
    const Message   = props.message || (props.status === 404 ?
        <Typography>We couldn't find the page you're looking for, are you sure this is where you're meant to be?</Typography> : <Typography>Something went terribly wrong and our team is currently looking into the issue, please try again later.</Typography>)

    return (
        <div className={ErrorCss.error}>
            <AppCard type="error">
                <div className={ErrorCss.errorContent}>
                    <div className={ErrorCss.image}>
                        <Icon iconName="sad-tear" size="10x"/>
                    </div>
                    <div className={ErrorCss.errorDetail}>
                        <div className={ErrorCss.title}>
                            <Typography.Title level={4}>{title}</Typography.Title>
                            <Typography.Title level={4} type="secondary">{props.status}</Typography.Title>
                        </div>
                        <Divider />
                        <div className={ErrorCss.message}>
                            {Message}
                        </div>
                    </div>
                </div>
            </AppCard>
        </div>
    )
}

Error.Page = (props: ErrorProps) => (
    <SingleContentPage>
        <Error {...props} />
    </SingleContentPage>
)

export {Error};