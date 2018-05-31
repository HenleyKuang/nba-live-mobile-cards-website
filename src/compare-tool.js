import React from 'react';
import $ from 'jquery';
import StatRow from './components/stat-row'
import {PlayerCardImgSrc, PlayerProfileUrl, convertInchesToHeightString} from './components/player-img-src'

class CardCompare extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            card_data1: {},
            card_data2: {}
        };

        this.getBadgeColor = this.getBadgeColor.bind(this);
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

    getBadgeColor(stat1, stat2) {
        if (stat1 > stat2) {
            return "badge-success";
        } else if (stat1 < stat2) {
            return "badge-danger";
        } else {
            return "badge-primary";
        }
    }

    render() {
        if (Object.keys(this.state.card_data1).length === 0 || Object.keys(this.state.card_data2).length === 0)
            return '';
        let playerOneDetails = [];
        let playerTwoDetails = [];
        let details = [{
                            name: "OVR",
                            accessor: "ovr"
                           }, {
                            name: "Height",
                            accessor: "height",
                            func: height => {
                                return convertInchesToHeightString(height)
                            }
                           }, {
                            name: "Total Advance Stats"
                           }];
        let detailNames = [];
        for (let i = 0; i < details.length; i++) {
            detailNames.push(<StatRow key={details[i].name} statName={details[i].name} padding="pb-1 pt-1 pr-0 pl-0" />);
            if (details[i].accessor) {
                let stat1 = this.state.card_data1[details[i].accessor];
                let stat2 = this.state.card_data2[details[i].accessor];
                let badgeStat1 = this.getBadgeColor(stat1, stat2);
                let badgeStat2 = this.getBadgeColor(stat2, stat1);
                if (details[i].func) {
                    stat1 = details[i].func(stat1)
                    stat2 = details[i].func(stat2)
                }
                playerOneDetails.push(<StatRow key={details[i].name} statValue={stat1} badgeType={badgeStat1} dflex={false} padding="p-1" />);
                playerTwoDetails.push(<StatRow key={details[i].name} statValue={stat2} badgeType={badgeStat2} dflex={false} padding="p-1" />);
            }
        }
        let playerOneStats = [];
        let playerTwoStats = [];
        let statNames = [];

        let playerOneTotalAdvanceStat = 0;
        let playerTwoTotalAdvanceStat = 0;
        for (let c = 1; c <= 2; c++) {
            for (let r = 1; r <= 8; r++) {
                const stat1 = this.state.card_data1.stats[`(${c},${r})`];
                playerOneTotalAdvanceStat += stat1.value;
                const stat2 = this.state.card_data2.stats[`(${c},${r})`];
                playerTwoTotalAdvanceStat += stat2.value;
                statNames.push(<StatRow key={stat1.name} statName={stat1.name} padding="pb-1 pt-1 pr-0 pl-0" />);
                playerOneStats.push(<StatRow key={stat1.name} statValue={stat1.value} badgeType={this.getBadgeColor(stat1.value, stat2.value)} dflex={false} padding="p-1" />);
                playerTwoStats.push(<StatRow key={stat1.name} statValue={stat2.value} badgeType={this.getBadgeColor(stat2.value, stat1.value)} dflex={false} padding="p-1" />);
            }
        }
        playerOneDetails.push(<StatRow key={"TAS"} statValue={playerOneTotalAdvanceStat} badgeType={this.getBadgeColor(playerOneTotalAdvanceStat, playerTwoTotalAdvanceStat)} dflex={false} padding="p-1" />)
        playerTwoDetails.push(<StatRow key={"TAS"} statValue={playerTwoTotalAdvanceStat} badgeType={this.getBadgeColor(playerTwoTotalAdvanceStat, playerOneTotalAdvanceStat)} dflex={false} padding="p-1" />)
        return <div>
            <div className="card text-center text-white bg-dark m-3">
                <div className="card-header">
                    <a className="btn btn-primary float-left m-1" href="/#/">Back</a>
                    <strong className="text-uppercase">{this.state.card_data1.name}</strong> vs <strong className="text-uppercase">{this.state.card_data2.name}</strong>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                        </div>
                        <div className="col-2 p-0 mb-1">
                            <li className={`list-group-item justify-content-between align-items-center list-group-item-dark p-0 ${this.state.dflex}`}>
                                <ul className="list-group">
                                    <a href={PlayerProfileUrl(this.state.card_data1.hash)} target="_blank" ><img alt='Card Img' className="w-100" src={PlayerCardImgSrc(this.state.card_data1.hash)} /></a>
                                </ul>
                            </li>
                        </div>
                        <div className="col-2 p-0 mb-1">
                            <li className={`list-group-item justify-content-between align-items-center list-group-item-dark p-0 ${this.state.dflex}`}>
                                <ul className="list-group">
                                    <a href={PlayerProfileUrl(this.state.card_data2.hash)} target="_blank" ><img alt='Card Img' className="w-100" src={PlayerCardImgSrc(this.state.card_data2.hash)} /></a>
                                </ul>
                            </li>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col pl-0 pr-1 mb-1">
                            <ul className="list-group">
                                {detailNames}
                            </ul>
                        </div>
                        <div className="col-2 p-0">
                            <ul className="list-group">
                                {playerOneDetails}
                            </ul>
                        </div>
                        <div className="col-2 p-0">
                            <ul className="list-group">
                                {playerTwoDetails}
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col pl-0 pr-1 mb-1">
                            <ul className="list-group">
                                {statNames}
                            </ul>
                        </div>
                        <div className="col-2 p-0">
                            <ul className="list-group">
                                {playerOneStats}
                            </ul>
                        </div>
                        <div className="col-2 p-0">
                            <ul className="list-group">
                                {playerTwoStats}
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