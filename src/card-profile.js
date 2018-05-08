import React from 'react';
import $ from 'jquery';
import StatRow from './components/stat-row'
import { PlayerCardImgSrc } from './components/player-img-src'

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
        }
    }

    CardData(hash) {
        $.getJSON ('//nba-live-mobile-parser-api.herokuapp.com/searchCardData/?hash=' + hash)
            .then(( results ) => this.setState({ card_data: results }));
    }

    render() {
        if (Object.keys(this.state.card_data).length === 0)
            return '';
        let columnOne = [];
        let columnTwo = [];
        for (let i = 1; i <= 8; i++) {
            const stat = this.state.card_data.stats[`(1,${i})`];
            // console.log(stat);
            columnOne.push(<StatRow key={i} statName={stat.name} statValue={stat.value} fontSize='h5' />);
        }
        for (let i = 1; i <= 8; i++) {
            const stat = this.state.card_data.stats[`(2,${i})`];
            // console.log(stat);
            columnTwo.push(<StatRow key={i} statName={stat.name} statValue={stat.value} fontSize='h5'/>);
        }
        return <div>
            <div className="card text-center text-white bg-dark m-3">
                <div className="card-header">
                    {this.state.card_data.name}
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <img alt='Card Img' src={PlayerCardImgSrc(this.state.card_data.hash)} />
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