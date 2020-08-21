import * as React from "react";
import cx from "classnames";
import { Progress } from "antd";

import TimerCss from "./Timer.css";

export interface TimerProps {
    timerInSeconds? : number;
    unit?: string;
    className?: string;
}

export function Timer(props: TimerProps) {

    const [timerValue, setTimerValue] = React.useState(props.timerInSeconds ? props.timerInSeconds : 0);
    let timerUpdater = React.useMemo(() => null, []);

    const updateInterval = nextTimerValue => {
        if(nextTimerValue > -1) {
            setTimerValue(nextTimerValue);
            timerUpdater = setTimeout(() => updateInterval(nextTimerValue - 1), 1000);
        }
    }

    React.useEffect(() => {
        if(timerValue > 0) {
            updateInterval(timerValue - 1);

            return () => clearTimeout(timerUpdater)
        }
    }, []);

    return (
        <div className={cx(TimerCss.timer, props.className ? props.className : null)}>
            <Progress
                type="circle"
                percent={Math.floor(((props.timerInSeconds - timerValue) / props.timerInSeconds) * 100)}
                format={() => `${timerValue}${props.unit ? props.unit: ''}`}
                width={50}
            />
        </div>
    )
}