
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import HeaderSection from "../../components/HeaderSection";
import { updateUser, getUser } from "../../http";
import Modal from '../../components/modal/Modal';

const enumToDisplayMapping = {
    admin: 'Super Admin',
    agent: 'Agent',
    leader: 'Leader',
    supervisor: 'Supervisor',
    manager: 'Manager',
    user: 'User',
    verifier: 'Verifier',
    advisor: 'Advisor',
    customer_service: 'Customer Service',
    junior_admin: 'Admin',
};

const permissionsList = [
    'Manage Customer', 
    'Manage User', 
    'Manage Team'
];

const EditUser = () => {
    const initialState = {
        name: '',
        email: '',
        mobile: '',
        password: '',
        type: '',
        address: '',
        profile: '',
        status: '',
        permissions: [],  // Initialize as an empty array,
        cnic:'',
        relativeName:'',
        relativePhone:'',
        relativeRelation:''
    };

    const [imagePreview, setImagePreview] = useState('/assets/icons/user.png');
    const [formData, setFormData] = useState(initialState);
    const [showModal, setShowModal] = useState(false);
    const [updateFormData, setUpdatedFormData] = useState(initialState);
    const [selectedValue, setSelectedValue] = useState(initialState.type);
    const [userType, setUserType] = useState('User');

    const { id } = useParams();

    useEffect(() => {
        (async () => {
            const res = await getUser(id);
            if (res.success) {
                console.log(res)
                setUserType(res.data.type);
                setFormData({
                    ...res.data,
                    permissions: Array.isArray(res.data.permissions) ? res.data.permissions : [], // Ensure it's an array
                    cnic: res.data.cnic || '', // Ensure this is set
                    relativeName: res.data.relativeName || '',
                    relativePhone: res.data.relativePhone || '',
                    relativeRelation: res.data.relativeRelation || '',
                });
              //  setImagePreview(res.data.image);
                setUpdatedFormData({
                    ...res.data,
                    permissions: Array.isArray(res.data.permissions) ? res.data.permissions : [], // Ensure it's an array
                    cnic: res.data.cnic || '',
                    relativeName: res.data.relativeName || '',
                    relativePhone: res.data.relativePhone || '',
                    relativeRelation: res.data.relativeRelation || '',
                });//
            }
        })();
    }, [id]);
    

    const inputEvent = (e) => {
        const { name, value } = e.target;
        setFormData((old) => ({
            ...old,
            [name]: value.toLowerCase() 
        }));

        setUpdatedFormData((old) => ({
            ...old,
            [name]: value.toLowerCase()
        }));
    };

    const handleChange = (event) => {
        const { value } = event.target;
        setSelectedValue(value);

        setFormData((old) => ({
            ...old,
            type: value
        }));

        setUpdatedFormData((old) => ({
            ...old,
            type: value
        }));
    };

    const handlePermissionChange = (event) => {
        const { value, checked } = event.target;
        setFormData((old) => ({
            ...old,
            permissions: checked
                ? [...old.permissions, value]
                : old.permissions.filter((perm) => perm !== value),
        }));
    
        setUpdatedFormData((old) => ({
            ...old,
            permissions: checked
                ? [...old.permissions, value]
                : old.permissions.filter((perm) => perm !== value),
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (updateFormData.type && !showModal) return setShowModal(true);
        
        const fd = new FormData();
        Object.keys(updateFormData).forEach((key) => {
            if (Array.isArray(updateFormData[key])) {
                updateFormData[key].forEach((item, index) => {
                    fd.append(`${key}[]`, item);
                });
            } else if (key === 'password' && !updateFormData[key]) {
                // Skip appending password if it's empty
                return;
            } else {
                fd.append(key, updateFormData[key]);
            }
        });
    
        const { success, message } = await updateUser(id, fd);
    
        if (success) {
            toast.success(message);
        } else {
            toast.error(message || "Failed to update user.");
        }
    };
    
    
    const captureImage = (e) => {
        const file = e.target.files[0];
        setFormData((old) => ({
            ...old,
            profile: file
        }));

        setUpdatedFormData((old) => ({
            ...old,
            profile: file
        }));

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
    };

    const modalAction = () => setShowModal(!showModal);

    return (
        <>
            {showModal &&
                <Modal close={modalAction} title="Update User" width='35%'>
                    <div className="row" style={{ margin: '20px' }}>
                        <div className="col col-md-4">
                            <div className="input-group justify-content-center text-center">
                                <img className='rounded' src={imagePreview} width='120' alt="" />
                            </div>
                        </div>
                        <div className="col col-md-8">
                            <table className='table table-md'>
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{formData.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{formData.email}</td>
                                    </tr>
                                    <tr>
                                        <th>User Type</th>
                                        <td>{formData.type}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="form-group col-md-12">
                        <label>Enter Your Password</label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <div className="input-group-text">
                                    <i className="fas fa-lock"></i>
                                </div>
                            </div>
                            <input
                                onChange={inputEvent}
                                value={formData.adminPassword}
                                type="password"
                                placeholder={`Enter Your Password To Change ${formData.name}'s Type`}
                                id='adminPassword'
                                name='adminPassword'
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="justify-content-center text-center mb-3">
                        <button className='btn btn-primary btn-lg' type='submit' form='updateUserForm' style={{ width: '30vh' }}>
                            Add {formData.type}
                        </button>
                    </div>
                </Modal>
            }
            <div className="main-content">
                <section className="section">
                    <HeaderSection title={`Edit ${userType}`} />
                    <div className="card">
                        <div className="card-body pr-5 pl-5 m-1">
                            <form className='row' onSubmit={onSubmit} id='updateUserForm'>
                                <div className="form-group col-md-12 text-center">
                                    <div className="input-group justify-content-center">
                                        <input
                                            type="file"
                                            id='profile'
                                            name='profile'
                                            className="form-control d-none"
                                            onChange={captureImage}
                                            accept="image/*"
                                        />
                                        <label htmlFor='profile'>
                                            <img className='rounded' src={imagePreview} width='120' alt="" />
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group col-md-6">
                                    <label>Enter Name</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">
                                                <i className="fas fa-user"></i>
                                            </div>
                                        </div>
                                        <input
                                            onChange={inputEvent}
                                            value={formData.name}
                                            type="text"
                                            id='name'
                                            name='name'
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="form-group col-md-6">
                                    <label>Enter Email</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">
                                                <i className="fas fa-envelope"></i>
                                            </div>
                                        </div>
                                        <input
                                            onChange={inputEvent}
                                            value={formData.email}
                                            type="email"
                                            id='email'
                                            name='email'
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="form-group col-md-6">
                                    <label>Enter Mobile Number</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">
                                                <i className="fas fa-phone"></i>
                                            </div>
                                        </div>
                                        <input
                                            onChange={inputEvent}
                                            value={formData.mobile}
                                            type="text"
                                            id='mobile'
                                            name='mobile'
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group col-md-6">
                                    <label>Enter Password</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">
                                                <i className="fas fa-lock"></i>
                                            </div>
                                        </div>
                                        <input
                                            onChange={inputEvent}
                                            value={formData.password}
                                            type="password"
                                            id='password'
                                            name='password'
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>User Type</label>
                                    <select
                                        id='type'
                                        name='type'
                                        className="form-control"
                                        value={selectedValue}
                                        onChange={handleChange}
                                    >
                                        {Object.entries(enumToDisplayMapping).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group col-md-6">
                                    <label>Enter CNIC</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">
                                                <i className="fas fa-id-card"></i>
                                            </div>
                                        </div>
                                        <input
                                            onChange={inputEvent}
                                            value={formData.cnic}
                                            type="number"
                                            id='cnic'
                                            name='cnic'
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group col-md-6">
                                    <label>Enter Relative Name</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">
                                                <i className="fas fa-user"></i>
                                            </div>
                                        </div>
                                        <input
                                            onChange={inputEvent}
                                            value={formData.relativeName}
                                            type="text"
                                            id='relativeName'
                                            name='relativeName'
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group col-md-6">
                                    <label>Enter Relative Mobile Number</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">
                                                <i className="fas fa-phone"></i>
                                            </div>
                                        </div>
                                        <input
                                            onChange={inputEvent}
                                            value={formData.relativePhone}
                                            type="number"
                                            id='relativePhone'
                                            name='relativePhone'
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Enter Relation With Relative</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">
                                            <i class="fa fa-users"></i>
                                            </div>
                                        </div>
                                        <input
                                            onChange={inputEvent}
                                            value={formData.relativeRelation}
                                            type="text"
                                            id='relativeRelation'
                                            name='relativeRelation'
                                            className="form-control"
                                        />
                                    </div>
                                </div>



                                <div className="form-group col-md-6">
                                    <label>Enter Address</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">
                                                <i className="fas fa-map-marker-alt"></i>
                                            </div>
                                        </div>
                                        <input
                                            onChange={inputEvent}
                                            value={formData.address}
                                            type="text"
                                            id='address'
                                            name='address'
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                        {selectedValue === 'junior_admin' && (
                                            <div className="form-group col-md-8">
                                                <label>Select Permissions</label>
                                                <div className="input-group">


                                                {permissionsList.map((perm) => (
                                                    <div key={perm} className="form-check form-check-inline">
                                                        <input
                                                            type="checkbox"
                                                            id={perm}
                                                            value={perm}
                                                            checked={formData.permissions.includes(perm)}
                                                            onChange={handlePermissionChange}
                                                            className="form-check-input"
                                                        />
                                                        <label className="form-check-label" htmlFor={perm}>
                                                            {perm}
                                                        </label>
                                                    </div>
                                                ))}
                                        
                                                </div>
                                            </div>

                                        )}
                                <div className="form-group col-md-4">
                            <label>User Status</label>
                            <select name='status' onChange={inputEvent} value={formData.status} className="form-control select2">
                                <option >active</option>
                                <option>banned</option>
                            </select>
                        </div>


                                <div className="justify-content-center text-center mb-3 col-md-12">
                                <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        style={{ width: '30vh' }}
                                    >
                                        Update {userType}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default EditUser;
