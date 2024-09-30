import { useState,resetForm, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import HeaderSection from "../../components/HeaderSection";
import { addUser } from "../../http";
import Modal from '../../components/modal/Modal';
import * as faceapi from 'face-api.js';
import { error } from "jquery";

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

const AddUser = () => {
    const [imagePreview, setImagePreview] = useState('/assets/icons/user.png');
    const [webcamStream, setWebcamStream] = useState(false);
    const [faceData, setFaceData] = useState(null);
    const videoRef = useRef(null);
    const initialState = {name:'', email:'', mobile:'', password:'', type:'Employee', address:'', profile:'', adminPassword:'', permissions: [], cnic:'',relativeName:'',relativePhone:'',relativeRelation:''};
    const [formData, setFormData] = useState(initialState);
    const [showModal, setShowModal] = useState(false);
    const [selectedValue, setSelectedValue] = useState(initialState.type);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                console.log('Tiny Face Detector model loaded');
            } catch (error) {
                console.error('Error loading Tiny Face Detector model:', error);
            }
            try {
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
                console.log('Face Landmark 68 model loaded');
            } catch (error) {
                console.error('Error loading Face Landmark 68 model:', error);
            }
            try {
                await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
                console.log('Face Recognition model loaded');
            } catch (error) {
                console.error('Error loading Face Recognition model:', error);
            }
            setModelsLoaded(true);
        };
        
        loadModels();
    }, []);

    const startWebcam = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoRef.current.srcObject = stream;
        setWebcamStream(true);
    };

    const captureFace = async () => {
        if (!modelsLoaded) {
            return toast.error('Models not loaded yet. Please wait.');
        }
        
        const video = videoRef.current;
        const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        
        if (detection) {
            setFaceData(detection.descriptor);
            setFormData((old) => ({
                ...old,
                faceData: detection.descriptor // Store faceData correctly here
            }));
            if(faceData !== null){
                console.log(faceData)
                toast.success('Face captured successfully!');

            }else{
                toast.error('Please try again')
            }
        } else {
            toast.error('No face detected. Please try again.');
        }
    };

    const stopWebcam = () => {
        const stream = videoRef.current.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        setWebcamStream(false);
    };
    const inputEvent = (e) => {
        const {name, value} = e.target;
        setFormData((old) => ({
            ...old,
            [name]: value
        }));
    }

    const handleChange = (event) => {
        const { value } = event.target;
        setSelectedValue(value);
        setFormData((old) => ({
            ...old,
            type: value  // Update the 'type' field in formData with the selected role
        }));
    };

    const handlePermissionChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedPermissions([...selectedPermissions, value]);
        } else {
            setSelectedPermissions(selectedPermissions.filter(permission => permission !== value));
        }
        setFormData((old) => ({
            ...old,
            permissions: checked
                ? [...old.permissions, value]
                : old.permissions.filter(permission => permission !== value)
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const { name, email, mobile, password, type, address, profile, permissions, cnic, relativeName, relativePhone, relativeRelation, faceData } = formData;
        if(faceData===null){
            return toast.error("Take Picture Again")
        }
        // Check if all required fields are filled
        if (!name || !email || !mobile || !password || !type || !address || !cnic || !faceData)  {
            return toast.error('All Fields Required');
        }
        if (!profile) {
            return toast.error('Please choose an image');
        }
        if (type === 'Admin' && !showModal) { 
            setShowModal(true); 
            return; 
        }
        
        // Create FormData and append values
        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        fd.append('mobile', mobile);
        fd.append('password', password);
        fd.append('type', type);
        fd.append('address', address);
        fd.append('profile', profile);
        fd.append('cnic', cnic);
        fd.append('relativeName', relativeName);
        fd.append('relativePhone', relativePhone);
        fd.append('relativeRelation', relativeRelation);
        fd.append('faceData', JSON.stringify(faceData)); // Store face descriptor as a string
    
        // Append permissions as JSON string
        if (permissions && permissions.length > 0) {
            fd.append('permissions', JSON.stringify(permissions));
        } else {
            fd.append('permissions', JSON.stringify([]));
        }
    
        try {
            const { success, message } = await addUser(fd);  // Make API call with FormData
            if (success) {
                toast.success(message);
                // Reset the form state
                setFormData(initialState);
                setImagePreview('/assets/icons/user.png');
                setSelectedValue(initialState.type);
                setSelectedPermissions([]);
                document.getElementById('profile').value = ''; // Clear the file input
            } else {
                toast.error(message || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error('An error occurred while adding the user');
        }
    };
    
    const captureImage = (e) => {
        const file = e.target.files[0];
        setFormData((old) => ({
            ...old,
            profile: file
        }));
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImagePreview(reader.result);
        }
    }

    const modalAction = () => setShowModal(!showModal);

    return (
        <>
            {showModal &&
                <Modal close={modalAction} title="Add Admin" width='35%'>
                    <div className="row" style={{margin:'20px'}}>
                        <div className="col col-md-4">
                            <div className="input-group justify-content-center text-center">
                                <img className='rounded' src={imagePreview} width='120' alt="" />
                            </div>
                        </div>
                        <div className="col col-md-8">
                            <table className='table table-md'>
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
                                placeholder={`Enter Your Password To Add ${formData.name} As An Admin`}
                                id='adminPassword'
                                name='adminPassword'
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="justify-content-center text-center mb-3">
                        <button className='btn btn-primary btn-lg' type='submit' form='addUserForm' style={{width:'30vh'}}>Add {formData.type}</button>
                    </div>
                </Modal>
            }

            <div className="main-content">
                <section className="section">
                    <HeaderSection title='Add User'/>
                    <div className="card">
                        <div className="card-body pr-5 pl-5 m-1">
                            <form className='row' onSubmit={onSubmit} id='addUserForm'>
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
                                 {/* Webcam section */}
                                 <div className="form-group col-md-12 text-center">
                                    <video ref={videoRef} width="300" height="200" autoPlay style={{ display: webcamStream ? 'block' : 'none' }} />
                                    <div>
                                        <button type="button" onClick={startWebcam} className='btn btn-secondary'>Start Webcam</button>
                                        <button type="button" onClick={captureFace} className='btn btn-secondary'>Capture Face</button>
                                        <button type="button" onClick={stopWebcam} className='btn btn-secondary'>Stop Webcam</button>
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
                                            type="number"
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
                                    <select id="role" value={selectedValue} onChange={handleChange} className="form-control select2">
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
                                                <i className="fas fa-map"></i>
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
                                

                                {selectedValue === "junior_admin" && (

                                <div className="form-group col-md-12">
                                    <label>Select Permissions</label>
                                    <div className="input-group">
                                        {permissionsList.map(permission => (
                                            <div key={permission} className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={permission}
                                                    value={permission}
                                                    checked={selectedPermissions.includes(permission)}
                                                    onChange={handlePermissionChange}
                                                />
                                                <label className="form-check-label" htmlFor={permission}>
                                                    {permission}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                )}

                                <div className="justify-content-center text-center mb-3">
                                    <button className='btn btn-primary btn-lg' type='submit' style={{width:'30vh'}}>Add {formData.type}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default AddUser;
