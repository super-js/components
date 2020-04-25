import * as React from "react";
import cx from "classnames";
import {fad} from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {IconName, library, SizeProp} from "@fortawesome/fontawesome-svg-core";

import IconCss from "./Icon.css";

library.add(fad);

export interface IconProps {
    iconName: IconName;
    size?: SizeProp;
    onClick?: () => void;
    spin?: boolean;
    danger?: boolean;
    className?: string
}

export const Icon = (props: IconProps) => {
    return (
        <FontAwesomeIcon
            className={cx(IconCss.icon, props.className, {
                [IconCss.danger] : props.danger
            })}
            icon={["fad", props.iconName]}
            size={props.size}
            onClick={props.onClick}
            spin={props.spin || props.iconName === "spinner"}
        />
    )
};

export type {IconName, SizeProp};