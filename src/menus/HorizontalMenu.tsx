import * as React               from "react";
import { Menu  }   from "antd";
import {History}    from "history";

import HorizontalMenuCss from './HorizontalMenu.css';
import { IMenuItem, getMenuItem} from "./MenuItem";
import Icon from "../icon";


export interface IHorizontalMenuProps {
    menuItems   : IMenuItem[],
    history?    : History
}

export default function HorizontalMenu(props: IHorizontalMenuProps) {

    const {menuItems, history} = props;

    const selectedByDefault = menuItems.findIndex(menuItem => menuItem.isSelectedByDefault);

    const [selectedMenuEntry, setSelectedMenuEntry] = React.useState(
        selectedByDefault > -1 ? menuItems[selectedByDefault].code : (menuItems.length > 0 ? menuItems[0].code : "")
    );

    return (
        <Menu
            className={HorizontalMenuCss.horizontalMenu}
            selectedKeys={[selectedMenuEntry]}
            onClick={ev => setSelectedMenuEntry(ev.key)}
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
