import React from 'react';
import $ from 'jquery';
import StatRow from './components/stat-row'
import PlayerCardImgSrc from './components/player-img-src'

class CardCompare extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            card_data1: {},
            card_data2: {}
        };
    }

    componentDidMount() {
        const paramsString = window.location.hash.split('?')[1];
        const params = new URLSearchParams(paramsString)
        if( params.get(`player_one`) && params.get(`player_two`) ) {
            const player_one_hash = params.get(`player_one`);
            const player_two_hash = params.get(`player_two`);
            this.CardData(player_one_hash, ( results ) => this.setState({ card_data1: results }));
            this.CardData(player_two_hash, ( results ) => this.setState({ card_data2: results }));
        }
    }

    CardData(hash, callback) {
        $.getJSON ('//nba-live-mobile-parser-api.herokuapp.com/searchCardData/?hash=' + hash)
            .then(callback);
    }

    render() {
        if (Object.keys(this.state.card_data1).length === 0 || Object.keys(this.state.card_data2).length === 0)
            return '';
        let playerOne = [];
        let playerTwo = [];
        for (let c = 1; c <= 2; c++) {
            for (let r = 1; r <= 8; r++) {
                const stat1 = this.state.card_data1.stats[`(${c},${r})`];
                const stat2 = this.state.card_data2.stats[`(${c},${r})`];
                if (stat1.value > stat2.value) {
                    stat1.badge = "badge-success"
                    stat2.badge = "badge-danger"
                } else if (stat1.value < stat2.value) {
                    stat1.badge = "badge-danger"
                    stat2.badge = "badge-success"
                }
                playerOne.push(<StatRow key={stat1.name} statName={stat1.name} statValue={stat1.value} badgeType={stat1.badge} />);
                playerTwo.push(<StatRow key={stat2.name} statName={stat2.name} statValue={stat2.value} badgeType={stat2.badge} reverse={true} />);
            }
        }
        return <div>
            <div className="card text-center text-white bg-dark m-3">
                <div className="card-header">
                    <strong className="text-uppercase">{this.state.card_data1.name}</strong> vs <strong className="text-uppercase">{this.state.card_data2.name}</strong>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <img alt='Card Img' className="w-25 p-3" src={PlayerCardImgSrc(this.state.card_data1.hash)} />
                            <ul className="list-group">
                                {playerOne}
                            </ul>
                        </div>
                        <div className="col">
                            <img alt='Card Img' className="w-25 p-3" src={PlayerCardImgSrc(this.state.card_data2.hash)} />
                            <ul className="list-group">
                                {playerTwo}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

// ========================================

const CardCompareHTML = () => (
    <CardCompare />
)

export default CardCompareHTML