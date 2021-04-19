import * as React from "react";
import type {History} from "history";
import cx from "classnames";
import {Button, Popconfirm}                       from 'antd';

import {Icon, IconName} from "../icon";
import {Processing} from "../processing";

import AppButtonCss from "./AppButton.css";

export interface IConfirmationResult {
    isValid: boolean;
    message: React.ReactNode;
}

export type TOnConfirmation = () => Promise<IConfirmationResult> | IConfirmationResult;

export interface AppButtonProps {
    history?: History;
    to?: string;
    label?: string;
    link?: boolean;
    danger?: boolean;
    warning?: boolean;
    iconName?: IconName;
    onConfirmation?: TOnConfirmation;
    disabled?: boolean;
    loading?: boolean;
    isSubmit?: boolean;
    onClick?: () => void | Promise<void>;
    fullWidth?: boolean;
    className?: string;
}

export interface AppButtonConfirmationState extends IConfirmationResult {
    confirming?: boolean;
}

export function AppButton(props: AppButtonProps) {

    const hasConfirmation = typeof props.onConfirmation === "function";

    const [isConfirmationVisible, setConfirmationVisibility] = React.useState(false);
    const [confirmationStatus, setConfirmationStatus] = React.useState<AppButtonConfirmationState>({
        isValid: false, message: "Do you wish to proceed?", confirming: false
    });

    const onConfirmation = async () => {
        setConfirmationVisibility(true);
        setConfirmationStatus({confirming: true, ...confirmationStatus});

        const confirmationResult = await props.onConfirmation();

        setConfirmationStatus({
            confirming: false, ...confirmationResult
        });
    };

    const onProceed = () => {
        if(confirmationStatus.isValid) {
            setConfirmationVisibility(false);
            onClick();
        }
    };

    const onClick = () => {
        if(props.history && props.to) {
            props.history.push(props.to);
        } else if(typeof props.onClick === "function") {
            props.onClick();
        }
    }

    const _renderButton = () => (
        <Button
            disabled={props.disabled}
            type={props.link ? "link" : "default"}
            shape="round"
            loading={props.loading}
            htmlType={props.isSubmit ? "submit" : "button"}
            onClick={hasConfirmation ? () => onConfirmation() : onClick}
            className={cx(AppButtonCss.button, {
                [AppButtonCss.link] : props.link,
                [AppButtonCss.danger] : props.danger,
                [AppButtonCss.warning] : props.warning,
                [AppButtonCss.fullWidth] : props.fullWidth
            }, props.className)}
        >
            {props.iconName ? <Icon iconName={props.iconName} /> : null}
            {props.label ? props.label.toUpperCase() : ""}
        </Button>
    );

    return hasConfirmation ? (
        <Popconfirm
            title={confirmationStatus.confirming ? <Processing /> : confirmationStatus.message}
            visible={isConfirmationVisible}
            onCancel={() => setConfirmationVisibility(false)}
            onConfirm={onProceed}
            okText={confirmationStatus.isValid ? "Proceed" : null}
            cancelText="Cancel"
            icon={<Icon iconName="comment-exclamation" />}
            overlayClassName={AppButtonCss.popConfirm}
            placement="topRight"
        >
            {_renderButton()}
        </Popconfirm>
    ) : _renderButton()
}

export * from "./AppButtonGroup";