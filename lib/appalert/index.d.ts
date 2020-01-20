export interface AppAlertProps {
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
}
declare const AppAlert: (props: AppAlertProps) => JSX.Element;
export default AppAlert;
