import React from 'react';
import $ from 'jquery';

class StatRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            statName: props.statName,
            statValue: props.statValue
        };
    }

    render() {
        return <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-dark">
            {this.state.statName}
            <h5>
                <span className="badge badge-primary badge-pill">
                    {this.state.statValue}
                </span>
            </h5>
        </li>
    }
}

class CardProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            card_data: {}
        };
    }

    componentDidMount() {
        const paramsString = window.location.hash.split('?')[1];
        const params = new URLSearchParams(paramsString)
        if( params.get(`player_id`) ) {
            const hash = params.get(`player_id`);
            this.CardData(hash);
        } else {
            this.CardData('a9087d96774876ceb567d0ab35d4f2b11c4d193e');
        }
    }

    CardData(hash) {
        $.getJSON ('//nba-live-mobile-parser-api.herokuapp.com/searchCardData/?hash=' + hash)
            .then(( results ) => this.setState({ card_data: results }));
    }

    PlayerCardImgSrc(hash) {
        return "//nba-live-mobile-parser-api.herokuapp.com/searchCardImage/?hash=" + hash;
    }

    render() {
        if (Object.keys(this.state.card_data).length === 0)
            return '';
        let columnOne = [];
        let columnTwo = [];
        for (let i = 1; i <= 8; i++) {
            const stat = this.state.card_data.stats[`(1,${i})`];
            // console.log(stat);
            columnOne.push(<StatRow key={i} statName={stat.name} statValue={stat.value} />);
        }
        for (let i = 1; i <= 8; i++) {
            const stat = this.state.card_data.stats[`(2,${i})`];
            // console.log(stat);
            columnTwo.push(<StatRow key={i} statName={stat.name} statValue={stat.value} />);
        }
        return <div>
            <div className="card text-center text-white bg-dark m-3">
                <div className="card-header">
                    {this.state.card_data.name}
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <img alt='Card Img' src={this.PlayerCardImgSrc(this.state.card_data.hash)} />
                        </div>
                        <div className="col">
                            <ul className="list-group">
                                {columnOne}
                            </ul>
                        </div>
                        <div className="col">
                            <ul className="list-group">
                                {columnTwo}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

// ========================================

const CardProfileHTML = () => (
    <CardProfile />
)

export default CardProfileHTML