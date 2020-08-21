import * as React from "react";
import {RouteProps, SwitchProps} from "react-router-dom";
import {History} from "history";

import {Row, Col, Layout, Skeleton} from "antd";

import {IMenuItem, VerticalMenu} from "../menus";

import SecondaryNavPageCss from "./SecondaryNavPage.css";

import {
    IPageRoute,
    IPageRouteToComponentMap,
    PageRouteToComponentMapProps,
    resolveToAndLabel,
    useCurrentSiteMapCode
} from "./utils";
import {PageGroup} from "./index";
import {AppCard} from "../appcard";
import {AppButton} from "../appbutton";

export interface SecondaryNavPageProps extends PageRouteToComponentMapProps {
    redirectToFirstOn?: string[];
    ReactRoute: React.ComponentClass<RouteProps>;
    ReactSwitch?: React.ComponentClass<SwitchProps>;
    routes: IPageRoute[];
    history: History;
    NotFound?: React.ComponentElement<any, any>;
    loading?: boolean;
}

function routesToMenuItems(routes: IPageRoute[]) {
    return routes
        .filter(route => route.isNavigationEntry)
        .map(route => ({
            ...route,
            children: route.children.length > 0 ? routesToMenuItems(route.children) : []
        }))
}

function routesToActionMenuItems(routes: IPageRoute[]) {
    return routes
        .filter(route => route.isNavigationEntry)
        .map(route => ({
            ...route,
            children: route.children.length > 0 ? routesToMenuItems(route.children) : []
        }))
}

interface ResolvedRoutes {
    menuItems: IMenuItem[];
    actionMenuItems: IPageRoute[];
}

function resolveRoutes(routes: IPageRoute[], actionRouteToComponentMap: IPageRouteToComponentMap): ResolvedRoutes {
    return routes.reduce((_, route) => {

        const routeToMenuItem = _route => {
            if(_route.isNavigationEntry) {
                _.menuItems.push({
                    ..._route,
                    children: _route.children.length > 0 ? routesToMenuItems(_route.children) : []
                })
            }
        }

        routeToMenuItem(route);
        if(actionRouteToComponentMap.hasOwnProperty(route.code)) _.actionMenuItems.push(route);

        return _;
    }, {
        menuItems: [],
        actionMenuItems: []
    })
}

export function SecondaryNavPage(props: SecondaryNavPageProps) {

    const {
        ReactRoute, routes, history, ReactSwitch, pageData = {}, pageRouteToComponentMap, actionRouteToComponentMap = {},  loading
    } = props;

    const {menuItems, actionMenuItems}          = React.useMemo(() => resolveRoutes(routes, actionRouteToComponentMap), [routes]);
    const currentSiteMapCodes                   = useCurrentSiteMapCode();

    return (
        <Layout>
            <Row gutter={16}>
                <Col xs={12} md={16} xl={18} xxl={20}>
                    <PageGroup
                        ReactRoute={ReactRoute}
                        ReactSwitch={ReactSwitch}
                        routes={routes}
                        history={history}
                        pageRouteToComponentMap={{
                            ...pageRouteToComponentMap,
                            ...actionRouteToComponentMap
                        }}
                        pageData={pageData}
                        NotFound={props.NotFound}
                        redirectToFirstOn={props.redirectToFirstOn}
                        loading={loading}
                    />
                </Col>
                <Col xs={0} md={8} xl={6} xxl={4}>
                    {loading ? (
                        <Skeleton title={false} active paragraph={{rows: Math.max(menuItems.length, 1), width: ["100%"]}}/>
                    ) : (
                        <React.Fragment>
                            {actionMenuItems.length > 0 ? (
                                <AppCard small>
                                    {actionMenuItems.map(actionMenuItem => (
                                        <AppButton
                                            key={actionMenuItem.code}
                                            link
                                            label={resolveToAndLabel(actionMenuItem.label, pageData)}
                                            iconName={actionMenuItem.iconName}
                                            className={SecondaryNavPageCss.navAction}
                                            onClick={() => history.push(resolveToAndLabel(actionMenuItem.to, pageData))}
                                        />
                                    ))}
                                </AppCard>
                            ) : null}
                            <VerticalMenu
                                history={history}
                                menuItems={menuItems}
                                currentMenuItemCodes={currentSiteMapCodes}
                            />
                        </React.Fragment>
                    )}
                </Col>
            </Row>
        </Layout>
    )
}