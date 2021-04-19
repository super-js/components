import * as React from "react";
import {Anchor, Skeleton, Typography} from "antd";
import type {History} from "history";

import {AppCard} from "../appcard";
import {Icon} from "../icon";

import VerticalMenuCss from "./VerticalMenu.css";
import {IMenuItem} from "./MenuItem";

export interface VerticalMenuProps {
    menuItems: IMenuItem[];
    history: History;
    currentMenuItemCodes: string[];
    resolverData?: any;
    isLoading?: boolean;
    sharedUseRef?: React.MutableRefObject<any>;
    title?: string;
}

export interface VerticalMenuItemsProps {
    onLinkClick: (e: React.MouseEvent<HTMLElement>, link: { title: React.ReactNode; href: string; }) => void;
    menuItems: IMenuItem[];
    anchorRef: React.Ref<any>;
    resolverData?: any;
}

const resolveToAndLabel = (input, data?: any) => typeof input === "function" ? input(data ? data : {}) : input;

const VerticalMenuItems = React.memo(function(props: VerticalMenuItemsProps) {

    const _renderLinks = (_menuItems: IMenuItem[]) => _menuItems
        .map((menuItem) => (
            <Anchor.Link
                key={menuItem.code}
                title={(
                    <div className={VerticalMenuCss.anchorLinkContent}>
                        {resolveToAndLabel(menuItem.label, props.resolverData)}
                        {menuItem.iconName ? <Icon iconName={menuItem.iconName} /> : null}
                    </div>
                )}
                href={resolveToAndLabel(menuItem.to, props.resolverData)}
            >
                {Array.isArray(menuItem.children) && menuItem.children.length > 0 ?
                    _renderLinks(menuItem.children) : null}
            </Anchor.Link>
        ));

    return (
        <Anchor ref={props.anchorRef} className={VerticalMenuCss.anchor} onClick={props.onLinkClick}>
            {_renderLinks(props.menuItems)}
        </Anchor>
    )
}, (prevProps, nextProps) => prevProps.menuItems === nextProps.menuItems);

export function VerticalMenu(props: VerticalMenuProps) {

    const {menuItems, history, currentMenuItemCodes, sharedUseRef} = props;

    const anchorRef             = sharedUseRef || React.useRef();
    const indexedMenuItems      = React.useMemo(() => {
        let _indexedMenuItems = {};

        const _processMenuItems = _menuItems => _menuItems.forEach(menuItem => {
            _indexedMenuItems[menuItem.code] = resolveToAndLabel(menuItem.to, props.resolverData);
            if(Array.isArray(menuItem.children) && menuItem.children.length > 0) _processMenuItems(menuItem.children);
        });

        _processMenuItems(menuItems);


        return _indexedMenuItems;
    }, [menuItems]);

    React.useEffect(() => {
        if(anchorRef.current) {
            const linkFound = [...currentMenuItemCodes].reverse().some(currentMenuItemCode => {
                if(indexedMenuItems.hasOwnProperty(currentMenuItemCode)) {
                    (anchorRef.current as Anchor).setCurrentActiveLink(indexedMenuItems[currentMenuItemCode]);
                    return true;
                }
            })

            if(!linkFound) (anchorRef.current as Anchor).setCurrentActiveLink("");
        }
    }, [currentMenuItemCodes, indexedMenuItems, history.location.pathname]);


    const onLinkClick = React.useCallback((ev, link) => {
        ev.preventDefault();
        if(history.location.pathname !== link.href) history.push(link.href);
    }, []);

    return (
        <AppCard small smallTitle={props.title}>
            {props.isLoading ? (
                <Skeleton active paragraph={{rows: 3}}/>
            ) : (
                <VerticalMenuItems
                    anchorRef={anchorRef}
                    menuItems={menuItems}
                    onLinkClick={onLinkClick}
                    resolverData={props.resolverData}
                />
            )}
        </AppCard>
    )
}