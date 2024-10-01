import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { doLogin } from "../../http";
import { useDispatch } from "react-redux";
import { setAuth } from '../../store/auth-slice';
import { toast } from "react-toastify";
import * as faceapi from 'face-api.js';
import logo from "../../assets/img/logo.svg";

const LoginForm = () => {  
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        loginFaceData: ''
    });
    const [webcamStream, setWebcamStream] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [loginFaceData, setLoginFaceData] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);
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
        const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks().withFaceDescriptor();

        if (detection) {
            setLoginFaceData(detection.descriptor);
            setFormData((old) => ({
                ...old,
                loginFaceData: detection.descriptor // Store faceData correctly here
            }));
            if(loginFaceData!==null){
                console.log(loginFaceData)
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
        const { name, value } = e.target;
        setFormData((old) => ({
            ...old,
            [name]: value
        }));
    };

    const onSubmit = async (e) => {

            e.preventDefault();
            const { email, password } = formData;
    
            if (!loginFaceData) {
                return toast.error('Take Picture Again');
            }
    
            if (!email || !password) {
                return toast.error('All Fields Required');
            }
    
            const loginData = {
                email,
                password,
                loginFaceData: JSON.stringify(loginFaceData) // Convert to string
            };
    
            const res = await doLogin(loginData);
            const { success } = res;
    
            if (success) {
                console.log(res.user)
                console.log(res.user.permissions)
                dispatch(setAuth(res.user));
            }
            else{
                toast.error("wrong credendtials")
            }


    };

    return (
        <div id="app">
            <section className="section">
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
                            <div className="login-brand">
                                <img src={logo} alt="logo" width="300" className="" />
                            </div>

                            <div className="card card-primary">
                                <div className="card-header"><h4>Login</h4></div>
                                <div className="card-body">
                                    <form onSubmit={onSubmit} className="needs-validation" noValidate="">
                                        {/* Webcam section */}
                                        <div className="form-group col-md-12 text-center">
                                            <video ref={videoRef} width="300" height="200" autoPlay style={{ display: webcamStream ? 'block' : 'none' }} />
                                            <div>
                                                <button type="button" onClick={startWebcam} className='btn btn-secondary'>Start Webcam</button>
                                                <button type="button" onClick={captureFace} className='btn btn-secondary'>Capture Face</button>
                                                <button type="button" onClick={stopWebcam} className='btn btn-secondary'>Stop Webcam</button>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input id="email" onChange={inputEvent} value={formData.email} type="email" className="form-control" name="email" tabIndex="1" required autoFocus />
                                            <div className="invalid-feedback">
                                                Please fill in your email
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="d-block">
                                                <label htmlFor="password" className="control-label">Password</label>
                                                <div className="float-right">
                                                    <NavLink to='/forgot' className="text-small">
                                                        Forgot Password?
                                                    </NavLink>
                                                </div>
                                            </div>
                                            <input id="password" onChange={inputEvent} value={formData.password} type="password" className="form-control" name="password" tabIndex="2" required />
                                            <div className="invalid-feedback">
                                                please fill in your password
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary btn-lg btn-block" tabIndex="4" style={{ backgroundColor: "#3935EA" }}>
                                                Login
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="simple-footer">
                                <a className="mt-5 ml-2" target="_blank" href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                    </svg>
                                </a>

                                <a className="ml-2" href="#" target="_blank" rel="noopener noreferrer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.25-.015-.726-.533-1.245-1.373-1.245S2.37 5.17 2.37 5.86c0 .684.521 1.25 1.372 1.25h.001zm8.165 8.212V9.607c0-1.655-.035-3.788-2.301-3.788-2.301 0-2.648 1.872-2.648 3.83v3.706h2.401v-3.18c0-.14.008-.283.039-.421.267-.83.865-1.699 1.869-1.699 1.3 0 1.822.978 1.822 2.419v3.083h2.401z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoginForm;
