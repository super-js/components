import * as React from "react";
import type {History} from "history";
import cx from "classnames";
import {Skeleton} from 'antd';

import AppButtonGroupCss from "./AppButtonGroup.css";
import {AppButton, AppButtonProps} from "./index";
import {AppCard} from "../appcard";

export interface AppButtonGroupProps {
    orientation?: "VERTICAL" | "HORIZONTAL";
    buttonItems: AppButtonProps[];
    history?: History;
    isLoading?: boolean;
}

export function AppButtonGroup(props: AppButtonGroupProps) {

    const orientation = props.orientation || "VERTICAL";

    return (
        <AppCard small className={cx(AppButtonGroupCss.appButtonGroup, {
            [AppButtonGroupCss.vertical] : orientation === "VERTICAL",
            [AppButtonGroupCss.horizontal] : orientation === "HORIZONTAL"
        })}>
            {props.isLoading ? (
                <Skeleton active paragraph={{rows: 2}} />
            ) : (
                props.buttonItems.map(buttonItem => (
                    <AppButton
                        fullWidth={orientation === "VERTICAL"}
                        history={props.history}
                        {...buttonItem}
                    />
                ))
            )}
        </AppCard>
    )
}