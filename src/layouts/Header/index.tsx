import * as React               from "react";
import { Avatar, Typography, Button, Dropdown }   from "antd";

import HeaderCss from './Header.css';

import ActionPopover, {ActionPopoverProps} from "./ActionPopover";

import {HorizontalMenu} from "../../menus";
import {IMenuItem} from "../../menus";

import {History} from "history";

export interface IHeaderProps {
    logo?       : string;
    title?      : string | JSX.Element;
    children?   : JSX.Element | JSX.Element[]
    menuItems?  : IMenuItem[],
    history?    : History;
    actionPopoverProps? :ActionPopoverProps;
    currentMenuItemCodes: string[];
}

export default function Header(props: IHeaderProps) {

    return (
        <div className={HeaderCss.header}>
            <div className={HeaderCss.logoAndTitleAndItems}>
                {props.logo ? (
                    <Avatar shape="square" size={40} src={props.logo} />
                ) : null}
                {props.title ? (
                    <Typography.Title level={4}>{props.title}</Typography.Title>
                ) : null}
                {Array.isArray(props.menuItems) && props.menuItems.length > 0 ? (
                    <div className={HeaderCss.menu}>
                        <HorizontalMenu
                            menuItems={props.menuItems}
                            history={props.history}
                            currentMenuItemCodes={props.currentMenuItemCodes}
                        />
                    </div>
                ) : null}
            </div>
            {props.actionPopoverProps ? (
                <ActionPopover {...props.actionPopoverProps} history={props.history} />
            ) : null}
        </div>
    )
}