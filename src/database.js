import React from 'react';
import ReactTable from "react-table";

import $ from 'jquery';

class Database extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            search: ''
        };
    }

    componentDidMount() {
        this.PlayerList();
    }

    PlayerList() {
        $.getJSON ('//nba-live-mobile-parser-api.herokuapp.com/search')
            .then(( results ) => this.setState({ players: results }));
    }

    PlayerCardImgSrc(hash) {
        return "//nba-live-mobile-parser-api.herokuapp.com/searchCardImage/?hash=" + hash;
    }

    PlayerProfileUrl(hash) {
      return "/#/card-profile?player_id=" + hash;
    }

    render() {
        let data = this.state.players
        if (this.state.search) {
            data = data.filter(row => {
                return row.name.toLowerCase().includes(this.state.search.toLowerCase())
            })
        }

      const columns = [{
        Header: "Card",
        accessor: 'hash',
        Cell: props => <a href={this.PlayerProfileUrl(props.value)} target="_blank" ><img width="40" alt='Card Img' src={this.PlayerCardImgSrc(props.value)} /></a>,
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
        <input
            type="text"
            className="form-control w-25 m-1"
            placeholder="Search.."
            aria-label="Search"
            aria-describedby="basic-addon1"
            value={this.state.search}
            onChange={e => this.setState({search: e.target.value})}
        />
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