import React from 'react';

class StatRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            statName: props.statName,
            statValue: props.statValue,
            statValue2: props.statValue2,
            badgeType: props.badgeType || 'badge-primary',
            badgeType2: props.badgeType || 'badge-primary',
            className: props.className,
            dflex: props.dflex === false ? '' : 'd-flex',
            listGroupClassName: props.listGroupClassName ? props.listGroupClassName : '',
            padding: props.padding ? props.padding : 'p-2'
        };
    }

    render() {
            return <li className={`list-group-item justify-content-between align-items-center list-group-item-dark ${this.state.padding} ${this.state.dflex} ${this.state.listGroupClassName}`}>
                {this.state.statName}
                <span className={`badge ${this.state.badgeType} badge-pill ${this.state.className}`}>
                    {this.state.statValue}
                </span>
            </li>
        }
}

export default StatRow