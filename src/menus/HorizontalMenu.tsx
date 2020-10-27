import * as React               from "react";
import { Menu  }   from "antd";
import type {History}    from "history";

import HorizontalMenuCss from './HorizontalMenu.css';
import { IMenuItem, getMenuItem} from "./MenuItem";
import {Icon} from "../icon";

export interface IHorizontalMenuProps {
    menuItems   : IMenuItem[],
    history?    : History;
    currentMenuItemCodes: string[];
}

export function HorizontalMenu(props: IHorizontalMenuProps) {

    const {menuItems, history, currentMenuItemCodes} = props;

    return (
        <Menu
            className={HorizontalMenuCss.horizontalMenu}
            selectedKeys={currentMenuItemCodes}
            mode="horizontal"
        >
            {menuItems.map(menuItem => Array.isArray(menuItem.children) && menuItem.children.length > 0 ? (
                <Menu.SubMenu
                    key={menuItem.code}
                    title={
                        <span>
                            <Icon iconName={menuItem.iconName} />
                            {menuItem.label}
                        </span>
                    }
                    className={HorizontalMenuCss.subMenu}
                >
                    {menuItem.children.map(childMenuItem =>
                        getMenuItem({menuItem: childMenuItem, history, dense: true})
                    )}
                </Menu.SubMenu>
            ) : getMenuItem({menuItem, history}))}
        </Menu>
    )
}
