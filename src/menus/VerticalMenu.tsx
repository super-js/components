import * as React from "react";
import {Anchor} from "antd";
import {History} from "history";

import {AppCard} from "../appcard";
import {Icon} from "../icon";

import VerticalMenuCss from "./VerticalMenu.css";
import {IMenuItem} from "./MenuItem";
import {useCallback} from "react";

export interface VerticalMenuProps {
    menuItems: IMenuItem[];
    history: History;
    currentMenuItemCodes: string[];
}

export interface VerticalMenuItemsProps {
    onLinkClick: (e: React.MouseEvent<HTMLElement>, link: { title: React.ReactNode; href: string; }) => void;
    menuItems: IMenuItem[];
    anchorRef: React.Ref<any>;
}

const resolveToAndLabel = input => typeof input === "function" ? input() : input;

const VerticalMenuItems = React.memo(function(props: VerticalMenuItemsProps) {

    const _renderLinks = (_menuItems: IMenuItem[]) => _menuItems
        .map((menuItem) => (
            <Anchor.Link
                key={menuItem.code}
                title={(
                    <div className={VerticalMenuCss.anchorLinkContent}>
                        {resolveToAndLabel(menuItem.label)}
                        {menuItem.iconName ? <Icon iconName={menuItem.iconName} /> : null}
                    </div>
                )}
                href={resolveToAndLabel(menuItem.to)}
            >
                {menuItem.children.length > 0 ? _renderLinks(menuItem.children) : null}
            </Anchor.Link>
        ));

    return (
        <Anchor ref={props.anchorRef} className={VerticalMenuCss.anchor} onClick={props.onLinkClick}>
            {_renderLinks(props.menuItems)}
        </Anchor>
    )
}, (prevProps, nextProps) => prevProps.menuItems === nextProps.menuItems);

export function VerticalMenu(props: VerticalMenuProps) {

    const {menuItems, history, currentMenuItemCodes} = props;

    const anchorRef             = React.useRef();
    const indexedMenuItems      = React.useMemo(() => {
        let _indexedMenuItems = {};

        const _processMenuItems = _menuItems => _menuItems.forEach(menuItem => {
            _indexedMenuItems[menuItem.code] = resolveToAndLabel(menuItem.to);
            if(menuItem.children.length > 0) _processMenuItems(menuItem.children);
        });

        _processMenuItems(menuItems);
        return _indexedMenuItems;
    }, [menuItems]);

    React.useEffect(() => {
        currentMenuItemCodes.reverse().some(currentMenuItemCode => {
            if(indexedMenuItems.hasOwnProperty(currentMenuItemCode)) {
                (anchorRef.current as Anchor).setCurrentActiveLink(indexedMenuItems[currentMenuItemCode]);
                return true;
            }
        })
    }, [currentMenuItemCodes]);


    const onLinkClick = useCallback((ev, link) => {
        ev.preventDefault();
        if(history.location.pathname !== link.href) history.push(link.href);
    }, []);

    return (
        <AppCard small>
            <VerticalMenuItems
                anchorRef={anchorRef}
                menuItems={menuItems}
                onLinkClick={onLinkClick}
            />
        </AppCard>
    )
}