import * as React       from "react";

import {Forms} from '../../components';

export default class DevelopmentForms extends React.Component {
    render() {
        return (
            <div>
                <Forms.BasicForm
                    title="Basic Form Example"
                    description="Basic Form Description"
                    error="Oh no!"
                    success="Oh yes!"
                    warning="Oh warning!"
                    info="Oh info!"
                    primaryActions={[
                        {code: 'primaryAction_1', label: 'SAVE', isFormSubmit: true},
                        {code: 'primaryAction_2', label: 'CANCEL', type: "danger"}
                    ]}
                    secondaryActions={[
                        {label: "Forgotten Password?"}
                    ]}
                />
            </div>
        )
    }
}