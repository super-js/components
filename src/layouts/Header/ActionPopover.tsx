import * as React from "react";
import {Button, Popover, Divider} from "antd";
import {IconName} from "@fortawesome/fontawesome-svg-core";
import {History} from "history";

import Icon from "../../icon";

import ActionPopoverCss from './ActionPopover.css';


export interface IActionPopoverItem {
    label   : string;
    onClick : () => void;
    to?     : string;
    iconName? : IconName;
}

export interface ActionPopoverProps {
    label       : string;
    history?    : History;
    actions?    : IActionPopoverItem[];
    items?      : IActionPopoverItem[];
}

export default function ActionPopover(props: ActionPopoverProps) {

    const hasActions    = Array.isArray(props.actions) && props.actions.length > 0;
    const hasItems      = Array.isArray(props.items) && props.items.length > 0;

    const [isVisible, setIsVisible] = React.useState(false);

    const onClick       = (triggerSource: IActionPopoverItem)  => {
        if(typeof triggerSource.onClick === "function") {
            triggerSource.onClick();
        }

        setIsVisible(false);
    };


    return (
        <Popover
            placement="bottomRight"
            visible={isVisible}
            onVisibleChange={_isVisible => !_isVisible ? setIsVisible(false) : null}
            overlayClassName={ActionPopoverCss.popOverWrapper}
            content={(
                <div className={ActionPopoverCss.popOver}>
                    {hasItems ? (
                        <div className={ActionPopoverCss.items}>
                            {props.items.map(item => (
                                <Button key={item.label} type="link" onClick={() => onClick(item)} className={ActionPopoverCss.item}>
                                    <Icon iconName={item.iconName} />
                                    {item.label.toUpperCase()}
                                </Button>
                            ))}
                        </div>
                    ) : null}
                    {hasActions && hasItems ? <Divider /> : null}
                    {hasActions ? (
                        <div className={ActionPopoverCss.actions}>
                            {props.actions.map(action => (
                                <Button key={action.label} type="primary" onClick={() => onClick(action)} >
                                    {action.label.toUpperCase()}
                                </Button>
                            ))}
                        </div>
                    ) : null}
                </div>
            )}
            trigger="click"

        >
            <Button type={"link"} onClick={() => setIsVisible(true)}>
                {props.label}
                <Icon iconName="arrow-down" />
            </Button>
        </Popover>
    )
}