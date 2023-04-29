import axios from 'axios';
import React, { useEffect, useState } from 'react'
import useCategories from '../../custom/useCategories'
import {useDebounce} from 'use-debounce'
import Swal from 'sweetalert2'
import { Link} from 'react-router-dom'

function Task() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [catdId, setCatId] = useState(null);
    const [orderBy, setOrderBy] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const debounsedSearchTerm=useDebounce(searchTerm,300);

    // console.log(debounsedSearchTerm);


    const checkIfTaskIsDone = (done) => (
        done ? (
            <span className="badge bg-success">
                Done
            </span>
        ) :
            (
                <span className="badge bg-danger">
                    Processing...
                </span>

            )
    )
    const fetchPrevNextTasks = (link) => {
        const url = new URL(link);
        setPage(url.searchParams.get('page'));
    }

    const deleteTask=(taskId)=>{
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(async(result) => {
            if (result.isConfirmed) {
                try{
                    const response=await axios.delete(`/api/tasks/${taskId}`);
                    Swal.fire(
                        'Deleted!',
                        response.data.message,
                        'success'
                      )
                      fetchTasks();
                }catch(error){
                    console.log(error);
                }
            }
          });
    }
    const renderPagination = () => (
        <ul className="pagination">
            {
                tasks.links?.map((link, index) => (
                    <li key={index} className="page-item">
                        <a
                            style={{ cursor: 'pointer' }}
                            onClick={() => fetchPrevNextTasks(link.url)}
                            className={`page-link ${link.active ? 'active' : ''}`}>
                            {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                        </a>

                    </li>

                ))
            }

        </ul>
    )

    useEffect(() => {
        if (!categories.length) {
            fetchCategories();
        }
        if (!tasks.length) {
            fetchTasks();
        }
    }, [page, catdId,orderBy,debounsedSearchTerm[0]]);

    const fetchCategories = async () => {
        const fetchedCategories = await useCategories();
        setCategories(fetchedCategories);
    }

    const fetchTasks = async () => {
        try {
            if (catdId) {
                const response = await axios.get(`/api/category/${catdId}/tasks?page=${page}`);
                setTasks(response.data);
            }else if(orderBy){
                const response = await axios.get(`/api/order/${orderBy.column}/${orderBy.direction}/tasks?page=${page}`);
                setTasks(response.data);
            }else if(debounsedSearchTerm[0] !== ''){
                const response = await axios.get(`/api/search/${debounsedSearchTerm[0]}/tasks?page=${page}`);
                setTasks(response.data);
            } else {
                const response = await axios.get(`/api/tasks?page=${page}`);
                setTasks(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='row my-5'>
            <div className="row my-3">
                <div className="col-md-4">
                    <div className="form-group">
                        <input type="text"
                        value={searchTerm}
                        onChange={(event)=>{
                            setCatId(null);
                            setOrderBy(null);
                            setPage(1);
                            setSearchTerm(event.target.value)
                        }}
                        placeholder='Search'

                        className="form-control rounded-0 border border-dark" />
                    </div>
                </div>
            </div>
            <div className="col-md-9">
                <div className="card">
                    <div className="card-body">
                        <table className="table table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Body</th>
                                    <th>Done</th>
                                    <th>Category</th>
                                    <th>Created</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tasks.data?.map(task => (
                                        <tr key={task.id}>
                                            <td>{task.id}</td>
                                            <td>{task.title}</td>
                                            <td>{task.body}</td>
                                            <td>
                                                {
                                                    checkIfTaskIsDone(task.done)
                                                }
                                            </td>
                                            <td>{task.category.name}</td>
                                            <td>{task.created_at}</td>
                                            <td className='d-flex'>
                                                <Link to={`/edit/${task.id}`} className="btn btn-sm btn-warning">
                                                    <i className="fas fa-pen"></i>
                                                </Link>
                                                <button
                                                onClick={()=>deleteTask(task.id)}
                                                className="btn btn-sm btn-danger mx-1">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <div className="my-4 d-flex justify-content-between">
                            <div>
                                Showing {tasks.from || 0} to {tasks.to || 0} from {tasks.total} resultas.
                            </div>
                            <div>
                                {renderPagination()}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="card">
                    <div className="card-header text-center bg-white">
                        <h5 className="mt-2">Filter by category</h5>
                    </div>
                    <div className="card-body">
                        <div className="form-check">
                            <input type="radio" name='category' className='form-check-input'
                                onChange={() => {
                                    setCatId(null);
                                    setOrderBy(null);
                                    setPage(1);
                                    // fetchTasks();
                                }} checked={!catdId ? true : false} />
                            <label htmlFor="category" className="form-check-label">All</label>
                        </div>
                        {
                            categories?.map(category => (
                                <div key={category.id} className="form-check">
                                    <input type="radio" name='category' className='form-check-input'
                                        onChange={(event) => {
                                            setOrderBy(null);
                                            setPage(1);
                                            setCatId(event.target.value);
                                        }}
                                        value={category.id}
                                        id={category.id}
                                        checked={catdId==category.id}
                                    />
                                    <label htmlFor={category.id} className="form-check-label">
                                        {category.name}
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="card mt-2">
                    <div className="card-header text-center bg-white">
                        <h5 className="mt-2">
                            Order by
                        </h5>
                    </div>
                    <div className="card-body">
                        <div>
                            <h6>ID</h6>
                            <div className="form-check">
                                <input type="radio" name='id'
                                value="asc"
                                className='form-check-input'
                                    onChange={(event) => {
                                        setCatId(null);
                                        setPage(1);
                                        setOrderBy({
                                            column:'id',
                                            direction:event.target.value
                                        })
                                    }}
                                    checked={orderBy && orderBy.column==='id' && orderBy.direction==='asc' ? true : false}
                                    />

                                <label htmlFor="id"
                                className="form-check-label">
                                    <i className="fas fa-arrow-up"></i>
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="radio" name='id'
                                value="desc"
                                className='form-check-input'
                                    onChange={(event) => {
                                        setCatId(null);
                                        setPage(1);
                                        setOrderBy({
                                            column:'id',
                                            direction:event.target.value
                                        })
                                    }}
                                    checked={orderBy && orderBy.column==='id' && orderBy.direction==='desc' ? true : false}
                                    />
                                <label htmlFor="id" className="form-check-label">
                                    <i className="fas fa-arrow-down"></i>
                                </label>
                            </div>
                        </div>
                        <hr />
                        <div>
                            <h6>Title</h6>
                            <div className="form-check">
                                <input type="radio" name='title'
                                value="asc"
                                className='form-check-input'
                                    onChange={(event) => {
                                        setCatId(null);
                                        setPage(1);
                                        setOrderBy({
                                            column:'title',
                                            direction:event.target.value
                                        })
                                    }}
                                    checked={orderBy && orderBy.column==='title' && orderBy.direction==='asc' ? true : false}
                                    />

                                <label htmlFor="title"

                                className="form-check-label">
                                    A-Z
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="radio" name='title'
                                value="desc"
                                className='form-check-input'
                                    onChange={(event) => {
                                        setCatId(null);
                                        setPage(1);
                                        setOrderBy({
                                            column:'title',
                                            direction:event.target.value
                                        })
                                    }}
                                    checked={orderBy && orderBy.column==='title' && orderBy.direction==='desc' ? true : false}
                                    />
                                <label htmlFor="title" className="form-check-label">
                                    Z-A
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Task
