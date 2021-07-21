import React from 'react'
import Header from './Header';
import Menubar from './Menubar';
import { Link } from 'react-router-dom'

function RiskLevelManagement() {
    return (<div>
        <Header />
        <div className="d-flex">
            <Menubar />
            <div className="means-body col-md-9 bg-light">
                <h4 className="p-5 mean-title">Risk Level Management</h4>
            </div>
        </div>
    </div>)


}

export default RiskLevelManagement;