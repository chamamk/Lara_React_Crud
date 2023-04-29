import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useCategories from '../../custom/useCategories'
import Swal from 'sweetalert2';


function Create() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        fetchCategories();
    }, [])

    const createTask = async (e) => {
        setLoading(true);
        e.preventDefault();
        const task = {
            title,
            body,
            category_id: categoryId
        };
        try {
            await axios.post('/api/tasks', task);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your task has been saved.',
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

    const renderErrors=(field)=>(
        errors?.[field]?.map((error,index)=>(
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
                            Create New Task
                        </h5>
                    </div>
                    <div className="card-body">
                        <form className="mt-5" onSubmit={(e) => createTask(e)}>
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
                            {
                                loading ?
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    <button type="submit" className="btn btn-success">Ajouter</button>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Create
