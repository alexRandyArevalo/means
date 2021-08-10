import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert'
import { Modal, OverlayTrigger, Popover } from "react-bootstrap"
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ClipLoader } from "react-spinners"
import Table from '../../table.component/table.component'
import {
    faTrashAlt,
    faEdit,
    faEllipsisH
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faTrashAlt,
    faEdit,
    faEllipsisH
);

class EmployeeList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: "",
            color: "#9500f3",
            prefix: "",
            loader: {
                loading: false,
                didmount: false
            },
            loader_edit: {
                loading_edit: false
            },
            employees: {
                data: []
            },
            modal: {
                showHide: false
            },
            employee: {
                eid: "",
                phoneno: "",
                lname: "",
                fname: "",
                mname: "",
                addr: ""
            }
        }
    }

    // Modal
    showModal = () => {
        this.setState({ modal: { showHide: true } })
    }

    hideModal = () => {
        this.setState({ modal: { showHide: false } })
    }

    // Prep Employees Data
    componentDidMount() {
        this.setState({ loader: { didmount: true } })
        this.setDataTable()
    }

    // Display List of Employees
    setDataTable() {
        console.log(this)
        if (this.state.loader.didmount)
            this.setState({ loader: { loading: true } }) // Show Loader
        axios.get("/employees")
            .then(res => {
                if (res.data.status) {
                    this.setState({
                        employees: {
                            data: res.data.data
                        }
                    })
                    this.setState({ loader: { loading: false } }) // Hide Loader
                } else {
                    console.log('Data not found')
                }
            })
            .catch(err => console.log(err))
    }

    // Delete Employee
    Delete = (that) => {
        Swal({
            title: `Delete ${that.lName}, ${that.fName}?`,
            html: true,
            text: "You won't be able to revert this!",
            icon: "warning",
            buttons: [
                'Cancel',
                'Delete'
            ],
            dangerMode: true,
        }).then(function (isConfirm) {
            if (isConfirm) {
                axios.delete(`/user/${that._id}`)
                    .then((res) => {
                        Swal({
                            title: 'Deleted!',
                            text: `${that.lName}, ${that.fName} has been deleted.`,
                            icon: 'success'
                        }).then(function () {
                            this.setDataTable()
                        });
                    }, (err) => {
                        console.log(err);
                    });
            } else {
                Swal("Cancelled", "Your imaginary file is safe :)", "error");
            }
        })
    }

    // Edit Employee
    Edit = (id) => {
        axios.get(`/employee/${id}`)
            .then(res => {
                if (res.data.status) {
                    this.setState({
                        id: id,
                        employee: {
                            eid: res.data.data.eid,
                            phoneno: res.data.data.contact,
                            lname: res.data.data.lName,
                            fname: res.data.data.fName,
                            mname: res.data.data.mName,
                            addr: res.data.data.address
                        }
                    })
                    this.showModal()
                } else {
                    console.log('User not found')
                }
            })
            .catch(err => console.log(err))
    }

    updateEmployee = (e) => {
        e.preventDefault()
        this.setState({ loader_edit: { loading_edit: true } }) // Show Loader
        let jsonData = {
            eid: e.target.eid.value,
            phoneno: e.target.phoneno.value,
            lname: e.target.lname.value,
            fname: e.target.fname.value,
            mname: e.target.mname.value,
            addr: e.target.addr.value
        }
        axios.patch(`/employee/${this.state.id}`, jsonData)
            .then((res) => {
                this.setDataTable()
                this.setState({ loader_edit: { loading_edit: false } }) // Hide Loader
                this.hideModal()
            }, (err) => {
                console.log(err);
            });
    }

    render() {
        return (<div>
            <div className="progress-wrapper">
            </div >
            <Table
                Header={
                    <tr>
                        <th width="5%">#</th>
                        <th width="13.5%">EID</th>
                        <th width="13.5%" className="text-nowrap">Last Name</th>
                        <th width="13.5%" className="text-nowrap">First Name</th>
                        <th width="13.5%" className="text-nowrap">Middle Name</th>
                        <th width="13.5%">Contact</th>
                        <th width="13.5%">Address</th>
                        <th width="13.5%"></th>
                    </tr>
                }
                Loader={
                    <div className="sweet-loading pt-2 ps-1">
                        <ClipLoader color={this.state.color} loading={this.state.loader.loading} size={24} />
                    </div>
                }
                Body={
                    this.state.employees.data.map((emp, index) =>
                    (<tr key={index}>
                        <td>{index + 1}</td>
                        <td className="text-truncate td-mw-12" title={emp.eid}>{this.state.employees.data[index].eid}</td>
                        <td className="text-truncate td-mw-12" title={emp.lName}>{this.state.employees.data[index].lName}</td>
                        <td className="text-truncate td-mw-12" title={emp.fName}>{this.state.employees.data[index].fName}</td>
                        <td className="text-truncate td-mw-12" title={emp.mName}>{this.state.employees.data[index].mName}</td>
                        <td className="text-truncate td-mw-12" title={emp.contact}>{this.state.employees.data[index].contact}</td>
                        <td className="text-truncate td-mw-12" title={emp.address}>{this.state.employees.data[index].address}</td>
                        <td>
                            <OverlayTrigger
                                trigger={'click'}
                                rootClose={true}
                                key={'top'}
                                placement={'top'}
                                overlay={
                                    <Popover>
                                        <Popover.Content>
                                            <a href="#" className="text-dark p-2" onClick={() => this.Delete(emp)}><FontAwesomeIcon icon="trash-alt" /></a>
                                            <a href="#" className="text-dark p-2" onClick={() => this.Edit(emp._id)}><FontAwesomeIcon icon="edit" /></a>
                                        </Popover.Content>
                                    </Popover>
                                }>
                                <a href="#" className="text-muted p-2 ellipsis" id={`Popover${index + 1}`}><FontAwesomeIcon icon="ellipsis-h" /></a>
                            </OverlayTrigger>
                        </td>
                    </tr>)
                    )
                }
            />
            <Modal show={this.state.modal.showHide} size="lg">
                <Modal.Header>
                    <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.updateEmployee}>
                    <Modal.Body>
                        <div className="row m-3">
                            <div className="col-md-7">
                                <label className="text-muted ps-1 fs-13">E.I.D</label>
                                <input
                                    onChange={(e) => this.setState({ employee: { eid: e.target.value } })}
                                    value={this.state.employee.eid}
                                    name="eid"
                                    type="email"
                                    className="form-control"
                                    placeholder="E.I.D"
                                    required
                                />
                            </div>
                            <div className="col-md-5">
                                <label className="text-muted ps-1 fs-13">Contact</label>
                                <div className="input-group">

                                    <input
                                        onChange={(e) => this.setState({ prefix: e.target.value })}
                                        type="text" className="form-control"
                                        value="+63"
                                        style={{ maxWidth: "55px" }}
                                    />
                                    <input
                                        onChange={(e) => this.setState({ employee: { phoneno: e.target.value } })}
                                        value={this.state.employee.phoneno}
                                        name="phoneno"
                                        type="text"
                                        className="form-control"
                                        placeholder="___-___-__"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-4">
                                <label className="text-muted ps-1 fs-13">Last Name</label>
                                <input
                                    onChange={(e) => this.setState({ employee: { lname: e.target.value } })}
                                    value={this.state.employee.lname}
                                    name="lname"
                                    type="text"
                                    className="form-control"
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                            <div className="col-md-4 mt-4">
                                <label className="text-muted ps-1 fs-13">First Name</label>
                                <input
                                    onChange={(e) => this.setState({ employee: { fname: e.target.value } })}
                                    value={this.state.employee.fname}
                                    name="fname"
                                    type="text"
                                    className="form-control"
                                    placeholder="First Name"
                                    required
                                />
                            </div>
                            <div className="col-md-4 mt-4">
                                <label className="text-muted ps-1 fs-13">Middle Name</label>
                                <input
                                    onChange={(e) => this.setState({ employee: { mname: e.target.value } })}
                                    value={this.state.employee.mname}
                                    name="mname"
                                    type="text"
                                    className="form-control"
                                    placeholder="Middle Name"
                                    required
                                />
                            </div>
                            <div className="col-md-12 mt-4">
                                <label className="text-muted ps-1 fs-13">Address</label>
                                <input
                                    onChange={(e) => this.setState({ employee: { addr: e.target.value } })}
                                    value={this.state.employee.addr}
                                    name="addr"
                                    type="text"
                                    className="form-control"
                                    placeholder="Address Line 1"
                                    required
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-secondary" onClick={() => this.hideModal()}>Cancel</button>
                        <button className="btn btn-success" type="submit">
                            <ClipLoader color={'#fff'} loading={this.state.loader_edit.loading_edit} size={10} />
                            &nbsp; Save &nbsp;
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>)
    }
}

export default EmployeeList;