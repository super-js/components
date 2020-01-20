export declare enum AppCardType {
    default = "default",
    success = "success",
    error = "error",
    warning = "warning"
}
export interface AppCardProps extends AppCardTitleProps, AppCardExtraProps {
    children: JSX.Element[] | JSX.Element | string;
    small?: boolean;
}
interface AppCardTitleProps {
    title?: string;
    type?: AppCardType;
}
interface AppCardExtraProps {
    description?: string;
    iconName?: string;
}
declare const AppCard: (props: AppCardProps) => JSX.Element;
export default AppCard;
