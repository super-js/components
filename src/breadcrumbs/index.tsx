import * as React from "react";
import type { History } from "history";
import {Breadcrumb, Typography} from "antd";

import {AppCard} from "../appcard";
import BreadcrumbsCss from "./Breadcrumbs.css";

export interface IBreadcrumbItem {
    label: string | React.ReactElement;
    to?: string;
    order?: number;
}

export interface IBreadcrumbsProps {
    breadcrumbItems: IBreadcrumbItem[];
    history: History;
}


export const Breadcrumbs = (props: IBreadcrumbsProps) => {

    const onBreadcrumbClick = (to: string) => props.history.push(to);

    return (
        <AppCard small className={BreadcrumbsCss.breadcrumbs}>
            <Breadcrumb>
                {props.breadcrumbItems.map(breadcrumbItem => (
                    <Breadcrumb.Item key={`${breadcrumbItem.label}_${breadcrumbItem.order}`}>
                        <span className={BreadcrumbsCss.breadCrumbItemContent}>
                            {breadcrumbItem.to ? (
                                <a onClick={() => onBreadcrumbClick(breadcrumbItem.to)}>{breadcrumbItem.label}</a>
                            ) : <Typography.Text>{breadcrumbItem.label}</Typography.Text>}
                        </span>
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
        </AppCard>
    )
};
