import { Component } from 'react';
import Table from '../../table.component/table.component'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
library.add(faPlus, faArrowLeft);

export default class AddRiskForm extends Component {
    state = {
        risklevelList: [],
        empty: null
    }

    // Add Risk Level
    AddRiskLevel = (e) => {
        e.preventDefault()
        if(!this.state.risklevel || !this.state.def) return;
        this.state.risklevelList.push({
            risklevel: this.state.risklevel,
            def: this.state.def,
        })
        this.setState({ empty: null })
        this.setState({
            risklevel: "",
            def: "",
        })
    }

    // Display Table
    getRisLevelList = () => {
        if (!this.state.risklevelList) return null
        return (
            <Table
                Header={
                    <tr>
                        <th width="5%">#</th>
                        <th width="35%">Risk Level</th>
                        <th width="60%">Definition</th>
                    </tr>
                }
                Body={
                    this.state.risklevelList.map((risklevel, key) =>
                    (<tr key={key}>
                        <th className="text-muted">{key + 1}</th>
                        <td className="text-muted">{risklevel.risklevel}</td>
                        <td className="text-muted">{risklevel.def}</td>
                    </tr>)
                    )
                } />
        )
    }

    // Handle Changes
    hasChanges = (datahere, e) => {
        this.setState({
            [datahere]: e.target.value
        })
    }

    // Save Risk Assessment to DB
    AddRiskAssess = (e) => {
        e.preventDefault()
        const jsonData = {
            title: this.state.title,
            address: this.state.address,
            city: this.state.city,
            region: this.state.region,
            desc: this.state.desc,
        }
        axios.post('/saveRiskAssessment', jsonData)
            .then((res) => {
                if (res.data.status) {
                    let risklevelData = {}
                    let raID = res.data.id
                    risklevelData[raID] = this.state.risklevelList
                    // Save Risk Level
                    axios.post('/saveRiskLevel', risklevelData)
                        .then((res) => {
                            console.log(res)
                        }, (err) => {
                            console.log(err);
                        });
                } else {
                    console.log('unable to save risk assessment')
                }
            }, (err) => {
                console.log(err);
            });
    }

    render() {
        return (<div>
            <form onSubmit={this.AddRiskAssess}>
                <div className="col-md-12 d-flex">
                    <div className="col-md-6 p-3">
                        <input onChange={this.hasChanges.bind(this, 'title')} value={this.state.title} name="title" type="text" className="form-control" placeholder="Title" required />
                    </div>
                    <div className="col-md-6 p-3">
                        <input onChange={this.hasChanges.bind(this, 'address')} value={this.state.address} name="address" type="text" className="form-control" placeholder="Address" required />
                    </div>
                </div>
                <div className="col-md-12 d-flex">
                    <div className="col-md-6 p-3">
                        <input onChange={this.hasChanges.bind(this, 'city')} value={this.state.city} name="city" type="text" className="form-control" placeholder="City" required />
                    </div>
                    <div className="col-md-6 p-3">
                        <input onChange={this.hasChanges.bind(this, 'region')} value={this.state.region} name="region" type="text" className="form-control" placeholder="Region" required />
                    </div>
                </div>
                <div className="col-md-12 mb-5">
                    <div className="col p-3">
                        <textarea onChange={this.hasChanges.bind(this, 'desc')} value={this.state.desc} name="desc" className="form-control" rows="3" placeholder="Description" required></textarea>
                    </div>
                </div>
                <div className="col-md-12">
                    <h5 className="ps-3">Risk Levels</h5>
                    <div className="col-md-12 d-flex add-risk">
                        <div className="col-md-4 p-3 align-self-center add-risk-list">
                            <input onChange={this.hasChanges.bind(this, 'risklevel')} value={this.state.risklevel} name="risklevel" type="text" className="form-control w-100 risk-level-field" placeholder="Risk Assessment Level" />
                        </div>
                        <div className="col-md-6 p-3 align-self-center add-risk-list">
                            <input onChange={this.hasChanges.bind(this, 'def')} value={this.state.def} name="def" type="text" className="form-control w-100 risk-level-field" placeholder="Definition" />
                        </div>
                        <div className="col-md-2 p-3 align-self-center add-risk-list" style={{ textAlign: "end" }}>
                            <button onClick={this.AddRiskLevel} type="button" className="btn_ btn-purple w-100"><FontAwesomeIcon icon="plus" /> Add</button>
                        </div>
                    </div>
                    {this.getRisLevelList()}
                </div>
                <div className="p-3 fs-3 col-6 mx-auto d-flex justify-content-center">
                    <button type="submit" className="btn_ btn-purple w-50">Submit</button>
                </div>
            </form>
        </div >)
    }
}
