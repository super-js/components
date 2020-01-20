import * as React from "react";

export interface InputProps {
    value			: any;
    onInput		    : (value: any) => void;
    onChange        : (ev: React.SyntheticEvent) => Promise<void>;
    readOnly		: boolean;
}

export interface InputState {
    value			: any;
}

export default class Input extends React.Component<InputProps, InputState> {
    render() {
        return undefined;
    }
}