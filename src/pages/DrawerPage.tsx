import * as React from "react";
import {Drawer} from "antd";

import { default as BasicForm, BasicFormCrudProps } from "../forms/basicform";

import DrawerPageCss from "./DrawerPage.css";

export interface DrawerPageProps {
    afterClose?: () => void;
    hasExit?: boolean;
    hasCancel?: boolean;
    children: React.ReactElement;
}

function DrawerPage(props: DrawerPageProps) {

    const [isVisible, setVisibility] = React.useState(true);

    const onExit = () => {
        setVisibility(false);
    };

    return (
        <Drawer
            placement="right"
            closable={false}
            afterVisibleChange={isVisible => !isVisible && typeof props.afterClose === "function" ? props.afterClose() : null}
            visible={isVisible}
            className={DrawerPageCss.drawerWrapper}
        >
            {props.hasExit || props.hasCancel ? React.cloneElement(
                props.children,
                {
                    onExit: props.hasExit ? onExit : null,
                    onCancel: props.hasCancel ? onExit : null
                }
            ) : props.children}
        </Drawer>
    )
}



export interface DrawerPageWithCRUDProps extends Omit<DrawerPageProps, 'children'> {
    crudProps: BasicFormCrudProps
}

DrawerPage.CRUD = (props: DrawerPageWithCRUDProps) => {

    const {crudProps, ...drawerPageProps} = props;

    return (
        <DrawerPage hasCancel {...drawerPageProps}>
            <BasicForm.CRUD
                fullHeight
                {...crudProps}
            />
        </DrawerPage>
    )
};

export default DrawerPage;