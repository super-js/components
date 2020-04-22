import * as React from "react";
import cx from "classnames";
import {notification, Typography} from "antd";

import Icon, {IconName} from "../icon";

import NotificationCss from "./Notification.css";

type NotificationType = 'success' | 'info' | 'error' | 'warning' | 'processing';

export interface INotification {
    key:  string;
    message: string;
    durationInSeconds?: number;
    type: NotificationType;
    iconName?: IconName;
    allowDismiss?: boolean;
}

export interface INotificationIcons {
    [name: string]: IconName;
}

export interface INotificationDurations {
    [name: string]: number;
}

const NotificationIcons: INotificationIcons = {
    info: 'smile-wink',
    success: 'smile',
    warning: 'meh',
    error: 'frown',
    processing: 'spinner'
};

const NotificationDurations: INotificationDurations = {
    info: 2,
    success: 2,
    warning: 3,
    error: 3,
    processing: 0
};


export function setNotification(props: INotification) {

    const type      = props.type === "processing" ? "info" : props.type;
    const iconName  = props.iconName || NotificationIcons[props.type];
    const duration  = props.durationInSeconds ? props.durationInSeconds : NotificationDurations[props.type];

    notification[type]({
        key: props.key,
        placement: "bottomLeft",
        message: <Typography.Text type="secondary">{props.message}</Typography.Text>,
        duration: duration,
        icon: <Icon iconName={iconName} />,
        closeIcon: props.allowDismiss ? null : <span></span>,
        className: cx(NotificationCss.notification, {
            [NotificationCss.error] : type === "error",
            [NotificationCss.success] : type === "success",
            [NotificationCss.warning] : type === "warning",
            [NotificationCss.info] : type === "info"
        })
    })
}