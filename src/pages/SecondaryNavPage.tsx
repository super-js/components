import * as React from "react";
import {RouteProps, SwitchProps} from "react-router-dom";
import {History} from "history";

import {Row, Col, Layout, Anchor} from "antd";

import SecondaryNavPageCss from "./SecondaryNavPage.css";
import AppCard from "../appcard";
import {IPageRoute, PageRouteToComponentMapProps} from "./utils";
import {PageGroup} from "./index";
import Icon from "../icon";


export interface SecondaryNavPageProps extends PageRouteToComponentMapProps {
    ReactRoute: React.ComponentClass<RouteProps>;
    ReactSwitch?: React.ComponentClass<SwitchProps>;
    routes: IPageRoute[];
    history: History;
    rootPath: string;
}


const resolveToAndLabel = input => typeof input === "function" ? input() : input;


function SecondaryNavPage(props: SecondaryNavPageProps) {

    const {ReactRoute, routes, rootPath, history, ReactSwitch, extraComponentProps = {}, pageRouteToComponentMap} = props;

    const anchorRef         = React.useRef();
    const anchorLinksRefs   = routes.map(() => React.useRef());

    React.useEffect(() => {
        if(history.location.pathname === rootPath
        && anchorLinksRefs.length > 0 && anchorLinksRefs[0].current) {
            (anchorLinksRefs[0].current as any).handleClick(new Event('click'));
        }
    }, []);

    const onLinkClick = (ev, link) => {
      ev.preventDefault();
      history.push(link.href);
    };

    const _renderLinks = (_routes: IPageRoute[]) => _routes
        .filter(route => route.isNavigationEntry)
        .map((route, ix) => (
            <Anchor.Link
                ref={anchorLinksRefs[ix]}
                key={route.code}
                title={(
                    <div className={SecondaryNavPageCss.anchorLinkContent}>
                        {resolveToAndLabel(route.label)}
                        {route.iconName ? <Icon iconName={route.iconName} /> : null}
                    </div>
                )}
                href={resolveToAndLabel(route.to)}
            >
                {route.children.some(child => child.isNavigationEntry) ? _renderLinks(route.children) : null}
            </Anchor.Link>
        ));

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
                    />
                </Col>
                <Col xs={0} md={8} xl={6} xxl={4}>
                    <AppCard small>
                        <Anchor ref={anchorRef} className={SecondaryNavPageCss.anchor} onClick={onLinkClick}>
                            {_renderLinks(routes)}
                        </Anchor>
                    </AppCard>
                </Col>
            </Row>
        </Layout>
    )
}

export default SecondaryNavPage;