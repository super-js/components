import * as React                   from 'react';
import type {History} from "history";
import cx                           from 'classnames';
import {IconName} from "@fortawesome/fontawesome-svg-core";
import {Card, Typography}                         from 'antd';
import appCardCss from './AppCard.css';
import {Icon} from "../icon";


export enum AppCardType {
    default = "default",
    success = "success",
    error   = "error",
    warning = "warning"
}

export interface AppCardProps extends AppCardTitleProps, AppCardExtraProps {
    children        : JSX.Element[] | JSX.Element | string;
    className?      : string;
    fullHeight?     : boolean;
    small?          : boolean
}

interface AppCardTitleProps {
    title?          : string | JSX.Element;
    type?           : keyof typeof AppCardType | AppCardType;
    onExit?         : () => void;
}

interface AppCardExtraProps {
    description?    : string,
    iconName?       : IconName
}

const AppCardTitle = (props: AppCardTitleProps): JSX.Element => props.title ? (
    <div className={appCardCss.appCardTitle}>
        {props.onExit ? (
            <Icon
                iconName="window-close"
                size="lg"
                onClick={props.onExit}
            />
        ) : null}
        <h4 className={cx({
            [appCardCss.error]      : props.type === AppCardType.error,
            [appCardCss.success]    : props.type === AppCardType.success,
            [appCardCss.warning]    : props.type === AppCardType.warning
        })}>
            {typeof props.title === "string" ? props.title.toUpperCase() : props.title}
        </h4>
    </div>
) : null;

const AppCardExtra = (props: AppCardExtraProps): JSX.Element => (
    <div className={appCardCss.appCardExtra}>
        {props.description  ? <Typography.Text type="secondary">{props.description}</Typography.Text> : null}
        {props.iconName     ? <Icon iconName={props.iconName}/> : null}
    </div>
);

export const AppCard = (props: AppCardProps): JSX.Element => {

    const {title, description, iconName, type, children, small, fullHeight, className, ...otherProps} = props;

    return (
        <Card
            className={cx(appCardCss.appCard, className, {
                [appCardCss.small]             : small,
                [appCardCss.appCardError]      : props.type === AppCardType.error,
                [appCardCss.appCardSuccess]    : props.type === AppCardType.success,
                [appCardCss.appCardWarning]    : props.type === AppCardType.warning,
                [appCardCss.fullHeight]        : fullHeight
            })}
            title={title                    ? <AppCardTitle title={title} type={type} {...otherProps} />    : null}
            extra={iconName || description  ? <AppCardExtra iconName={iconName} description={description} />    : null}
        >
            {children}
        </Card>
    )
};