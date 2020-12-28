import * as React from "react";
import {Typography, Divider} from "antd";

import ErrorCss from './Error.css';
import {Icon} from "../icon";
import {AppCard} from "../appcard";

import {AppButton} from "../appbutton";

export interface IAppErrorAction {
    label: string;
    onClick: () => void;
}

export interface AppErrorProps {
    title?      : string;
    status?     : number;
    message?    : JSX.Element | string;
    actions?: IAppErrorAction[];
}

const ERRORS = {
    404: {
        Icon: <Icon iconName="sad-tear" />,
        title: 'Page not found',
        Message: <Typography>The page you're looking for doesn't exist.</Typography>
    },
    500: {
        Icon: <Icon iconName="sad-cry" />,
        title: 'Oops, something went wrong',
        Message: <Typography>An unexpected error has occurred. Please try again or contact the support.</Typography>
    }
}


export function AppError(props: AppErrorProps) {

    const StatusIcon = ERRORS[props.status] ? ERRORS[props.status].Icon : <Icon iconName="frown" />;
    const title = ERRORS[props.status] ? ERRORS[props.status].title : ERRORS[500].title;
    const Message = ERRORS[props.status] ? ERRORS[props.status].Message : ERRORS[500].Message;

    return (
        <AppCard type="error" fullHeight className={ErrorCss.error}>
            <div className={ErrorCss.errorContent}>
                <div className={ErrorCss.image}>
                    {StatusIcon}
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
            <div className={ErrorCss.errorActions}>
                {props.actions ? props.actions.map((action) => (
                    <AppButton
                        key={action.label}
                        link
                        label={action.label}
                        onClick={action.onClick}
                    />
                )) : null}
            </div>
        </AppCard>
    )
}