import * as React from "react";
import { Typography, Divider, Progress } from "antd";

import {SingleContentPage} from "../pages"

import OverlayCss from "./Overlay.css";
import {AppCard} from "../appcard";
import {AppButton} from "../appbutton";
import {IconName} from "../icon";
import {Timer, TimerProps} from "../timer";

export interface IOverlayAction {
    label: string;
    onClick: () => void;
}

export interface OverlayProps extends TimerProps {
    title?          : string;
    iconName?       : IconName;
    message?        : string;
    actions?        : IOverlayAction[];
}

function Overlay(props: OverlayProps) {

    const hasActions = Array.isArray(props.actions) && props.actions.length > 0;

    return (
        <div className={OverlayCss.overlay}>
            <SingleContentPage.Narrow>
                <AppCard
                    title={props.title}
                    iconName={props.iconName}
                    type="warning"
                >
                    {props.message ? (
                        <div className={OverlayCss.message}>
                            <Typography.Text>{props.message}</Typography.Text>
                        </div>
                    ) : null}
                    {props.timerInSeconds ? <Timer timerInSeconds={props.timerInSeconds} className={OverlayCss.timer} unit="s" /> : null }
                    {(props.message || props.timerInSeconds) && hasActions ? <Divider /> : null}
                    {hasActions ? (
                        <div className={OverlayCss.actions}>
                            {props.actions.map(action => (
                                <AppButton key={action.label} label={action.label} onClick={action.onClick} />
                            ))}
                        </div>
                    ) : null}
                </AppCard>
            </SingleContentPage.Narrow>
        </div>
    )
}

Overlay.InactivityTimeout = (props: OverlayProps) => {
    return props.timerInSeconds > 0 ? (
        <Overlay
            title="Inactivity Warning"
            message="Please click anywhere in the window to stay logged in. Otherwise you'll be automatically logged out in"
            iconName="stopwatch"
            {...props}
        />
    ) : null;
}

export {Overlay};