import React from 'react';
import ReactTable from "react-table";
import ReactTooltip from 'react-tooltip'
// import { SplitButton, MenuItem, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { Button, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {PlayerCardImgSrc, PlayerProfileUrl, convertInchesToHeightString} from './components/player-img-src'

import $ from 'jquery';

class Database extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alertMsg: '',
            players: [],
            search: '',
            searchMenuOpen: false,
            posSelectedOption: [],
            typeSelectedOption: [],
            selectCompareCards: false,
            compareCards: {}
        };

        this._forceOpen = false;

        this.showHideCompareSelectionColumn = this.showHideCompareSelectionColumn.bind(this);
        this.addCompareCard = this.addCompareCard.bind(this);
        this.showHideAlertMsg = this.showHideAlertMsg.bind(this);
        this.convertEpochToLocalTime = this.convertEpochToLocalTime.bind(this);
        this.getTotalStats = this.getTotalStats.bind(this);
        this.dropDownToggle = this.dropDownToggle.bind(this);
        this.preventSearchMenuForceClose = this.preventSearchMenuForceClose.bind(this);
        this.onPosCheckboxBtnClick = this.onPosCheckboxBtnClick.bind(this);
        this.onTypeCheckboxBtnClick = this.onTypeCheckboxBtnClick.bind(this);
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
            <a key='' href={this.CompareCardsUrl(hash1,hash2)} target="_blank"><button type="button" className="btn btn-success" onClick={this.showHideAlertMsg}>Click here to compare</button></a>
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

    dropDownToggle() {
      if (this._forceOpen){
        this.setState({ searchMenuOpen: true });
        this._forceOpen = false;
      } else {
        this.setState({
          searchMenuOpen: !this.state.searchMenuOpen
        });
      }
    }

    preventSearchMenuForceClose() {
      this._forceOpen = true
    }

    onPosCheckboxBtnClick(selected) {
      const index = this.state.posSelectedOption.indexOf(selected);
      if (index < 0) {
        this.state.posSelectedOption.push(selected);
      } else {
        this.state.posSelectedOption.splice(index, 1);
      }
      this.setState({ posSelectedOption: [...this.state.posSelectedOption] });
    }

    onTypeCheckboxBtnClick(selected) {
      const index = this.state.typeSelectedOption.indexOf(selected);
      if (index < 0) {
        this.state.typeSelectedOption.push(selected);
      } else {
        this.state.typeSelectedOption.splice(index, 1);
      }
      this.setState({ typeSelectedOption: [...this.state.typeSelectedOption] });
    }

    render() {
      let data = this.state.players
      if (this.state.search) {
        data = data.filter(row => {
          return row.name.toLowerCase().includes(this.state.search.toLowerCase())
        })
      }
      if (this.state.posSelectedOption.length > 0) {
        data = data.filter(row => {
          return this.state.posSelectedOption.includes(row.pos)
        })
      }
      if (this.state.typeSelectedOption.length > 0) {
        data = data.filter(row => {
          return this.state.typeSelectedOption.includes(row.type)
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
        <ButtonDropdown isOpen={this.state.searchMenuOpen} toggle={this.dropDownToggle}>
          <DropdownToggle caret>
            <div className="input-group d-inline-block p-0">
              <input
                type="text"
                className="form-control w-100 m-0"
                placeholder="Search.."
                aria-label="Search"
                aria-describedby="basic-addon1"
                value={this.state.search}
                onChange={e => this.setState({search: e.target.value})}
              />
            </div>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Position</DropdownItem>
            <DropdownItem>
              <ButtonGroup onClick={() => this.preventSearchMenuForceClose()}>
                <Button outline color="primary" onClick={() => this.onPosCheckboxBtnClick("PG")} active={this.state.posSelectedOption.includes("PG")}>PG</Button>
                <Button outline color="primary" onClick={() => this.onPosCheckboxBtnClick("SG")} active={this.state.posSelectedOption.includes("SG")}>SG</Button>
                <Button outline color="primary" onClick={() => this.onPosCheckboxBtnClick("SF")} active={this.state.posSelectedOption.includes("SF")}>SF</Button>
                <Button outline color="primary" onClick={() => this.onPosCheckboxBtnClick("PF")} active={this.state.posSelectedOption.includes("PF")}>PF</Button>
                <Button outline color="primary" onClick={() => this.onPosCheckboxBtnClick("C")} active={this.state.posSelectedOption.includes("C")}>C</Button>
              </ButtonGroup>
            </DropdownItem>
            <DropdownItem header>Type</DropdownItem>
            <DropdownItem>
              <ButtonGroup onClick={() => this.preventSearchMenuForceClose()}>
                <Button outline color="primary" onClick={() => this.onTypeCheckboxBtnClick("BAL")} active={this.state.typeSelectedOption.includes("BAL")}>BAL</Button>
                <Button outline color="primary" onClick={() => this.onTypeCheckboxBtnClick("DEF")} active={this.state.typeSelectedOption.includes("DEF")}>DEF</Button>
                <Button outline color="primary" onClick={() => this.onTypeCheckboxBtnClick("SHT")} active={this.state.typeSelectedOption.includes("SHT")}>SHT</Button>
                <Button outline color="primary" onClick={() => this.onTypeCheckboxBtnClick("POW")} active={this.state.typeSelectedOption.includes("POW")}>POW</Button>
                <Button outline color="primary" onClick={() => this.onTypeCheckboxBtnClick("RUN")} active={this.state.typeSelectedOption.includes("RUN")}>RUN</Button>
              </ButtonGroup>
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        {/* <SplitButton
          bsStyle='default'
          className="p-0 m-0"
          title={<div className="input-group p-0">
              <input
                type="text"
                className="form-control w-100 m-0"
                placeholder="Search.."
                aria-label="Search"
                aria-describedby="basic-addon1"
                value={this.state.search}
                onChange={e => this.setState({search: e.target.value})}
              />
            </div>
          }
          id="dropdownsearch"
        >
          <ButtonToolbar>
            <ToggleButtonGroup type="checkbox">
              <ToggleButton value={1} className="btn-primary">PG</ToggleButton>
              <ToggleButton value={2} className="btn-primary">SG</ToggleButton>
              <ToggleButton value={3} className="btn-primary">SF</ToggleButton>
              <ToggleButton value={4} className="btn-primary">PF</ToggleButton>
              <ToggleButton value={5} className="btn-primary">C</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </SplitButton> */}
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