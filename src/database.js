import React from 'react';
import ReactTable from "react-table";
import ReactTooltip from 'react-tooltip'
import {PlayerCardImgSrc, PlayerProfileUrl, convertInchesToHeightString} from './components/player-img-src'

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
        this.convertEpochToLocalTime = this.convertEpochToLocalTime.bind(this);
        this.getTotalStats = this.getTotalStats.bind(this);
    }

    componentDidMount() {
        this.PlayerList();
    }

    PlayerList() {
        $.getJSON ('//nba-live-mobile-parser-api.herokuapp.com/search/')
            .then(( results ) => this.setState({ players: results }));
    }

    CompareCardsUrl(hash1, hash2) {
      return `/#/compare?player_one=${hash1}&player_two=${hash2}`
    }

    getTotalStats(stats) {
      let total = 0;
      for(let index in stats) {
        let stat = stats[index];
        total += stat.value;
      }
      return total;
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

    convertEpochToLocalTime(utcSeconds) {
      var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
      d.setUTCSeconds(utcSeconds);
      return d.toLocaleString();
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

      const statRowWidth = 40
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
        width: statRowWidth
      }, {
        Header: 'POS',
        accessor: 'pos',
        width: statRowWidth
      }, {
        Header: 'LU',
        accessor: 'type',
        width: 50
      }, {
        Header: 'HT',
        accessor: 'height',
        Cell: props => <span className='number'>{convertInchesToHeightString(props.value)}</span>,
        width: statRowWidth
      }, {
        Header: "SPD",
        accessor: "stats[(1,1)].value",
        width: statRowWidth
      }, {
        Header: "AGL",
        accessor: "stats[(1,2)].value",
        width: statRowWidth
      }, {
        Header: "MRS",
        accessor: "stats[(1,3)].value",
        width: statRowWidth
      }, {
        Header: "3PT",
        accessor: "stats[(1,4)].value",
        width: statRowWidth
      }, {
        Header: "IPS",
        accessor: "stats[(1,5)].value",
        width: statRowWidth
      }, {
        Header: "PST",
        accessor: "stats[(1,6)].value",
        width: statRowWidth
      }, {
        Header: "DNK",
        accessor: "stats[(1,7)].value",
        width: statRowWidth
      }, {
        Header: "SWC",
        accessor: "stats[(1,8)].value",
        width: statRowWidth
      }, {
        Header: "OBD",
        accessor: "stats[(2,1)].value",
        width: statRowWidth
      }, {
        Header: "BLK",
        accessor: "stats[(2,2)].value",
        width: statRowWidth
      }, {
        Header: "STL",
        accessor: "stats[(2,3)].value",
        width: statRowWidth
      }, {
        Header: "DRI",
        accessor: "stats[(2,4)].value",
        width: statRowWidth
      }, {
        Header: "PSA",
        accessor: "stats[(2,5)].value",
        width: statRowWidth
      }, {
        Header: "BOX",
        accessor: "stats[(2,6)].value",
        width: statRowWidth
      }, {
        Header: "ORB",
        accessor: "stats[(2,7)].value",
        width: statRowWidth
      }, {
        Header: "DRB",
        accessor: "stats[(2,8)].value",
        width: statRowWidth
      }, {
        id: "TAS",
        Header: <strong data-tip="Total Advance Stats">TAS</strong>,
        accessor: player_data => {
          return this.getTotalStats(player_data.stats)
        },
        Cell: props => <strong>{props.value}</strong>,
        width: 50
      }, {
        id: 'add_time',
        Header: "Date Added",
        accessor: "add_time",
        Cell: props => <span>{this.convertEpochToLocalTime(props.value)}</span>,
        width: 150
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

        <ReactTooltip place="top" type="dark" effect="float"/>
        <ReactTable
          pageSize={10}
          minRows = {0}
          style={{fontSize: '12px'}}
          defaultSorted={[{
            /* id: 'add_time', */
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