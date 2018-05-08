import React from 'react';
import ReactTable from "react-table";
import {PlayerCardImgSrc, PlayerProfileUrl} from './components/player-img-src'

import $ from 'jquery';

class Database extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alertMsg: '',
            players: [],
            search: '',
            selectCompareCards: false,
            compareCards: {}
        };

        this.showHideCompareSelectionColumn = this.showHideCompareSelectionColumn.bind(this);
        this.addCompareCard = this.addCompareCard.bind(this);
        this.showHideAlertMsg = this.showHideAlertMsg.bind(this);
    }

    componentDidMount() {
        this.PlayerList();
    }

    PlayerList() {
        $.getJSON ('//nba-live-mobile-parser-api.herokuapp.com/search')
            .then(( results ) => this.setState({ players: results }));
    }

    CompareCardsUrl(hash1, hash2) {
      return `/#/compare?player_one=${hash1}&player_two=${hash2}`
    }

    showHideCompareSelectionColumn() {
      this.setState({
        alertMsg: this.state.selectCompareCards ? '' : 'Select 2 cards to compare',
        selectCompareCards: !this.state.selectCompareCards,
        compareCards: []
      });
    }

    showHideAlertMsg() {
      this.setState({
        alertMsg: this.state.alertMsg.length > 0 ? '' : 'Select 2 cards to compare',
      });
    }

    addCompareCard(player_data) {
      this.setState((prevState) => {
        let newAlertMsg = ''
        let showSelectCompareCards = true
        let compareCardHashes = Object.keys(this.state.compareCards)
        if (compareCardHashes.length === 0) {
          newAlertMsg = 'Select 1 more card to compare'
        } else if (compareCardHashes.length === 1) {
          const hash1 = compareCardHashes[0]
          const hash2 = player_data[0]
          const playerName1 = prevState.compareCards[hash1]
          const playerName2 = player_data[1]
          newAlertMsg = [
            `Two cards have been selected: ${playerName1} and ${playerName2} `,
            <a href={this.CompareCardsUrl(hash1,hash2)} target="_blank"><button type="button" className="btn btn-success" onClick={this.showHideAlertMsg}>Click here to compare</button></a>
          ]
          showSelectCompareCards = false
        }
        let hash = player_data[0]
        let newCompareCardsState = prevState.compareCards
        newCompareCardsState[hash] = player_data[1]
        return {
          compareCards: newCompareCardsState,
          selectCompareCards: showSelectCompareCards,
          alertMsg: newAlertMsg
        };
      });
    }

    render() {
        let data = this.state.players
        if (this.state.search) {
            data = data.filter(row => {
                return row.name.toLowerCase().includes(this.state.search.toLowerCase())
            })
        }

      const columns = [{
        id: 'Select',
        Header: "Select",
        accessor: player_data => {
          return [player_data.hash, player_data.name]
        },
        Cell: props => <button type="button" className="btn btn-success" onClick={() => this.addCompareCard(props.value)} disabled={this.state.compareCards.hasOwnProperty(props.value[0])}>Select</button>,
        width: 80,
        sortable: false,
        show: this.state.selectCompareCards
      }, {
        Header: "Card",
        accessor: 'hash',
        Cell: props => <a href={PlayerProfileUrl(props.value)} target="_blank" ><img width="40" alt='Card Img' src={PlayerCardImgSrc(props.value)} /></a>,
        className: "p-0",
        width: 45,
        sortable: false
      }, {
        Header: 'Name',
        accessor: 'name',
        minWidth: 100
      }, {
        id: 'ovr',
        Header: 'OVR',
        accessor: 'ovr',
        Cell: props => <span className='number'>{props.value}</span>,
        width: 50
      }, {
        Header: 'POS',
        accessor: 'pos',
        width: 50
      }, {
        Header: 'LU',
        accessor: 'type',
        width: 50
      }, {
        Header: 'HT',
        accessor: 'height',
        width: 50
      }, {
        Header: "SPD",
        accessor: "stats[(1,1)].value",
        width: 50
      }, {
        Header: "AGL",
        accessor: "stats[(1,2)].value",
        width: 50
      }, {
        Header: "MRS",
        accessor: "stats[(1,3)].value",
        width: 50
      }, {
        Header: "3PT",
        accessor: "stats[(1,4)].value",
        width: 50
      }, {
        Header: "IPS",
        accessor: "stats[(1,5)].value",
        width: 50
      }, {
        Header: "PST",
        accessor: "stats[(1,6)].value",
        width: 50
      }, {
        Header: "DNK",
        accessor: "stats[(1,7)].value",
        width: 50
      }, {
        Header: "SWC",
        accessor: "stats[(1,8)].value",
        width: 50
      }, {
        Header: "OBD",
        accessor: "stats[(2,1)].value",
        width: 50
      }, {
        Header: "BLK",
        accessor: "stats[(2,2)].value",
        width: 50
      }, {
        Header: "STL",
        accessor: "stats[(2,3)].value",
        width: 50
      }, {
        Header: "DRI",
        accessor: "stats[(2,4)].value",
        width: 50
      }, {
        Header: "PSA",
        accessor: "stats[(2,5)].value",
        width: 50
      }, {
        Header: "BOX",
        accessor: "stats[(2,6)].value",
        width: 50
      }, {
        Header: "ORB",
        accessor: "stats[(2,7)].value",
        width: 50
      }, {
        Header: "DRB",
        accessor: "stats[(2,8)].value",
        width: 50
      }]

    return <div>
      {this.state.alertMsg.length > 0 && <div className="alert alert-success" role="alert">
        {this.state.alertMsg}
      </div>}
      <div className="btn-toolbar m-2" role="toolbar" aria-label="Toolbar with button groups">
        <div className="input-group">
          <input
                  type="text"
                  className="form-control w-25 m-1"
                  placeholder="Search.."
                  aria-label="Search"
                  aria-describedby="basic-addon1"
                  value={this.state.search}
                  onChange={e => this.setState({search: e.target.value})}
              />
        </div>
        <div className="btn-group ml-3" role="group" aria-label="First group">
          <button type="button" className="btn btn-success" onClick={this.showHideCompareSelectionColumn}>Comparison Tool</button>
        </div>
        <div className="btn-group ml-3" role="group" aria-label="First group">
          <button type="button" className="btn btn-info" disabled>Team Analyzer (Coming Soon)</button>
        </div>
      </div>

        <ReactTable
            pageSize={10}
            minRows = {0}
            style={{fontSize: '12px'}}
            defaultSorted={[{
                id: 'ovr',
                desc: true
              }]}
            data={data}
            columns={columns}
        />
      </div>
    }
}

// ========================================

const DatabaseHTML = () => (
    <Database />
)

export default DatabaseHTML