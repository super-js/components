import * as React from "react";
import cx from "classnames";
import {Menu, Typography} from "antd";
import {History} from "history";
import {IconName} from "@fortawesome/fontawesome-svg-core";

import {Icon} from "../icon";

import MenuItemCss from './MenuItem.css';

export interface IMenuItem {
    code        : string,
    label       : string,
    iconName?   : IconName,
    children?   : IMenuItem[],
    onClick?    : (menuItem: IMenuItem) => void;
    to?         : string;
}

export interface MenuItemProps {
    key?        : string;
    menuItem    : IMenuItem;
    history     : History;
    dense?      : boolean
}

export const getMenuItemClickHandler   = (menuItem: IMenuItem, history?: History) => typeof menuItem.onClick === "function" ?
    () => menuItem.onClick(menuItem) : (menuItem.to && history ? () => history.push(menuItem.to) : () => undefined);

export const getMenuItem = (props: MenuItemProps) => {
    const {key, menuItem, history} = props;

    return (
        <Menu.Item
            key={key ? key : menuItem.code}
            onClick={getMenuItemClickHandler(menuItem, history)}
            className={cx(MenuItemCss.menuItem, {
                [MenuItemCss.dense] : props.dense
            })}
        >
            <div className={MenuItemCss.content}>
                {menuItem.iconName ? <Icon iconName={menuItem.iconName} /> : null}
                <Typography.Text>{menuItem.label}</Typography.Text>
            </div>
        </Menu.Item>
    )
};

export const MenuItem = (props: MenuItemProps) => {
    return getMenuItem(props);
};