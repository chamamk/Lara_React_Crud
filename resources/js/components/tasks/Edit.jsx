import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useCategories from '../../custom/useCategories'
import Swal from 'sweetalert2';
import axios from 'axios';


function Edit() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(0);
    const navigate = useNavigate();
    const { taskId } = useParams();

    useEffect(() => {
        fetchTask();
        fetchCategories();
    }, [])

    const fetchTask = async () => {
        try {
            const response = await axios.get(`/api/tasks/${taskId}`)
            setTitle(response.data.title);
            setBody(response.data.body);
            setCategoryId(response.data.category_id);
            setDone(response.data.done);
        } catch (error) {
            console.log(error);
        }
    }
    const editTask = async (e) => {
        setLoading(true);
        e.preventDefault();
        const task = {
            title,
            body,
            category_id: categoryId,
            done
        };
        try {
            await axios.put(`/api/tasks/${taskId}`, task);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your task has been updated.',
                showConfirmButton: false,
                timer: 1500
            });
            setLoading(false);
            navigate('/task');
        } catch (error) {
            setLoading(false);
            console.log(error);
            setErrors(error.response.data.errors);
        }
    }

    const renderErrors = (field) => (
        errors?.[field]?.map((error, index) => (
            <div key={index} className="text-white my-2 rounded p-2 bg-danger">
                {error}
            </div>
        ))
    )


    const fetchCategories = async () => {
        const fetchedCategories = await useCategories();
        setCategories(fetchedCategories);
    }

    return (
        <div className='row my-5'>
            <div className="col-md-6 mx-auto">
                <div className="card">
                    <div className="card-header bg-white">
                        <h5 className="text-center mt-2">
                            Edit Task
                        </h5>
                    </div>
                    <div className="card-body">
                        <form className="mt-5" onSubmit={(e) => editTask(e)}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input type="text" placeholder='Title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="form-control" id="title" aria-describedby="emailHelp" />
                            </div>
                            {renderErrors('title')}
                            <div className="mb-3">
                                <label htmlFor="body" className="form-label">Body*</label>
                                <textarea name="body" id="body"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className='form-control'
                                    cols="30" rows="5" placeholder='Body*'></textarea>
                            </div>
                            {renderErrors('body')}
                            <div className="mb-3 form-check">
                                <label htmlFor="category_id" className="form-label">Category*</label>
                                <select className="form-select" name='category_id'
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    <option disabled value="">Choose a category</option>
                                    {
                                        categories?.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))
                                    }
                                </select>
                                {renderErrors('category_id')}
                            </div>
                                <div className="my-3 form-check">
                                    <input type="radio" name='done' className='form-check-input'
                                        onChange={() =>
                                            setDone(!done)
                                        }
                                        value={done}
                                        checked={done} />
                                    <label htmlFor="done" className="form-check-label">Done</label>
                                </div>
                                {
                                    loading ?
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        :
                                        <button type="submit" className="btn btn-warning">Modifier</button>
                                }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Edit
