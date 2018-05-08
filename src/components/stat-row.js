import React from 'react';

class StatRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            statName: props.statName,
            statValue: props.statValue,
            badgeType: props.badgeType || 'badge-primary',
            className: props.className,
            reverse: props.reverse || false
        };
    }

    render() {
        if (this.state.reverse === false) {
            return <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-dark">
                {this.state.statName}
                <span className={`badge ${this.state.badgeType} badge-pill ${this.state.className}`}>
                    {this.state.statValue}
                </span>
            </li>
        } else {
            return <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-dark">
                <span className={`badge ${this.state.badgeType} badge-pill ${this.state.className}`}>
                    {this.state.statValue}
                </span>
                {this.state.statName}
            </li>
        }
    }
}

export default StatRow