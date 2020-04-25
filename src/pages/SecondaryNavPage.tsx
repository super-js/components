import * as React from "react";
import {RouteProps, SwitchProps} from "react-router-dom";
import {History} from "history";

import {Row, Col, Layout, Anchor} from "antd";

import {VerticalMenu} from "../menus";

import {IPageRoute, PageRouteToComponentMapProps, useCurrentSiteMapCode} from "./utils";
import {PageGroup} from "./index";

export interface SecondaryNavPageProps extends PageRouteToComponentMapProps {
    ReactRoute: React.ComponentClass<RouteProps>;
    ReactSwitch?: React.ComponentClass<SwitchProps>;
    routes: IPageRoute[];
    history: History;
    NotFound?: React.ComponentElement<any, any>;
}

function routesToMenuItems(routes: IPageRoute[]) {
    return routes
        .filter(route => route.isNavigationEntry)
        .map(route => ({
            ...route,
            children: route.children.length > 0 ? routesToMenuItems(route.children) : []
        }))
}

export function SecondaryNavPage(props: SecondaryNavPageProps) {

    const {ReactRoute, routes, history, ReactSwitch, extraComponentProps = {}, pageRouteToComponentMap} = props;

    const menuItems             = React.useMemo((() => routesToMenuItems(routes)), [routes]);
    const currentSiteMapCodes    = useCurrentSiteMapCode();

    return (
        <Layout>
            <Row gutter={16}>
                <Col xs={12} md={16} xl={18} xxl={20}>
                    <PageGroup
                        ReactRoute={ReactRoute}
                        ReactSwitch={ReactSwitch}
                        routes={routes}
                        pageRouteToComponentMap={pageRouteToComponentMap}
                        extraComponentProps={extraComponentProps}
                        NotFound={props.NotFound}
                    />
                </Col>
                <Col xs={0} md={8} xl={6} xxl={4}>
                    <VerticalMenu
                        history={history}
                        menuItems={menuItems}
                        currentMenuItemCodes={currentSiteMapCodes}
                    />
                </Col>
            </Row>
        </Layout>
    )
}