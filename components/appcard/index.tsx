import * as React                   from 'react';
import cx                           from 'classnames';

import {Card, Icon, Typography}                         from 'antd';
import appCardCss from './AppCard.css';

export enum AppCardType {
    default = "default",
    success = "success",
    error   = "error",
    warning = "warning"
}

export interface AppCardProps extends AppCardTitleProps, AppCardExtraProps {
    children     : JSX.Element[] | JSX.Element | string;
    small?       : boolean
}

interface AppCardTitleProps {
    title?          : string;
    type?           : AppCardType;
}

interface AppCardExtraProps {
    description?    : string,
    iconName?       : string
}

const AppCardTitle = (props: AppCardTitleProps): JSX.Element => props.title ? (
    <div className={appCardCss.appCardTitle}>
        <h4 className={cx({
            [appCardCss.error]      : props.type === AppCardType.error,
            [appCardCss.success]    : props.type === AppCardType.success,
            [appCardCss.warning]    : props.type === AppCardType.warning
        })}>{props.title}</h4>
    </div>
) : null;

const AppCardExtra = (props: AppCardExtraProps): JSX.Element => (
    <div className={appCardCss.appCardExtra}>
        {props.description  ? <Typography.Text type="secondary">{props.description}</Typography.Text> : null}
        {props.iconName     ? <Icon type={props.iconName}/> : null}
    </div>
);

const AppCard = (props: AppCardProps): JSX.Element => {

    const {title, description, iconName, type, children, small, ...otherProps} = props;

    return (
        <Card
            className={cx(appCardCss.appCard, {
                [appCardCss.small]             : small,
                [appCardCss.appCardError]      : props.type === AppCardType.error,
                [appCardCss.appCardSuccess]    : props.type === AppCardType.success,
                [appCardCss.appCardWarning]    : props.type === AppCardType.warning
            })}
            title={title                    ? <AppCardTitle title={title} type={type} />                        : null}
            extra={iconName || description  ? <AppCardExtra iconName={iconName} description={description} />    : null}
        >
            {children}
        </Card>
    )
};

export default AppCard;