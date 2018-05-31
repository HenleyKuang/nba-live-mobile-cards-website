import React from 'react';
import $ from 'jquery';
import StatRow from './components/stat-row'
import { PlayerCardImgSrc, convertInchesToHeightString } from './components/player-img-src'

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
        let details = [];
        let columnOne = [];
        let columnTwo = [];
        let totalAdvanceStat = 0;
        for (let i = 1; i <= 8; i++) {
            const stat = this.state.card_data.stats[`(1,${i})`];
            totalAdvanceStat += stat.value;
            // console.log(stat);
            columnOne.push(<StatRow key={i} statName={stat.name} statValue={stat.value} />);
        }
        for (let i = 1; i <= 8; i++) {
            const stat = this.state.card_data.stats[`(2,${i})`];
            totalAdvanceStat += stat.value;
            // console.log(stat);
            columnTwo.push(<StatRow key={i} statName={stat.name} statValue={stat.value} />);
        }
        details.push(<StatRow key="2" statName="OVR" statValue={this.state.card_data.ovr} />);
        details.push(<StatRow key="3" statName="Height" statValue={convertInchesToHeightString(this.state.card_data.height)} />);
        details.push(<StatRow key="4" statName="Total Advance Stats" statValue={totalAdvanceStat} />);
        return <div>
            <div className="card text-center text-white bg-dark m-3">
                <div className="card-header">
                    <a className="btn btn-primary float-left m-1 ml-0" href="/#/">Back</a>
                    {this.state.card_data.name}
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col w-100">
                            <img alt='Card Img' src={PlayerCardImgSrc(this.state.card_data.hash)} />
                            {details}
                        </div>
                        <div className="col">
                            <div className="row">
                                <div className="col p-0">
                                    <ul className="list-group">
                                        {columnOne}
                                    </ul>
                                </div>
                                <div className="col p-0">
                                    <ul className="list-group">
                                        {columnTwo}
                                    </ul>
                                </div>
                            </div>
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