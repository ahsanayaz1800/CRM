

import { useState, useRef, useEffect } from "react";
import HeaderSection from "../../components/HeaderSection";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from '../../store/auth-slice';
import {useSelector} from 'react-redux';
import { toast } from "react-toastify";
import * as faceapi from 'face-api.js';
import { Row , Button} from "react-bootstrap";
import { markAttendance } from "../../http";
const AttendancePage = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name:'',
        email: '',
        password: '',
        attendanceFaceData: ''
    });
    const [webcamStream, setWebcamStream] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [attendanceFaceData, setattendanceFaceData] = useState(null);
    const videoRef = useRef(null);
    const { user } = useSelector(state => state.authSlice);


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
            setattendanceFaceData(detection.descriptor);
            setFormData((old) => ({
                ...old,
                attendanceFaceData: detection.descriptor // Store faceData correctly here
            }));
            if(attendanceFaceData!==null){
                console.log(attendanceFaceData)
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

 
    const onSubmit = async (e) => {

            e.preventDefault();
    
            if (!attendanceFaceData) {
                return toast.error('Take Picture Again');
            }
            const currentTime = new Date();
            const hours = currentTime.getHours();
        
            // Check if current time is before or at 8 PM
            const status = hours < 20 ? 'Present' : 'Late';
          
    
            const loginData = {
                name:user.name,
                email:user.email,
                userId:user.id,
                attendanceFaceData: JSON.stringify(attendanceFaceData), // Convert to string
                attendanceStatus:status
            };
             try{
                const res = await markAttendance (loginData)
                const {status}= res
                if(status===200){
                    toast.success("Your Attendance Has Been Marked !")

                }
                if(status===500){

                    toast.error("Wrong Details")
                }
                if(status===400){
                    toast.error("Attendance already marked in the last 24 hours")
                }
               
             }catch(error){
                console.log(error)


             }
            // const res = await (loginData);
            // const { success } = res;
    


    };

    return (
        <>
            <div className="main-content">
                <section className="section">
                    <HeaderSection title="Attendance" /> {/* Changed title to Agents */}
                    <div className="card">
                        <div className="card-header">
                            <h4>Mark Your Attendance </h4> {/* Adjusted the heading */}
                        </div>
                        <div className="card-body p-0">
                            {/* Webcam section */}
                            <div className="form-group col-md-12 text-center">
                                            <video ref={videoRef} width="300" height="200" autoPlay style={{ display: webcamStream ? 'block' : 'none' }} />
                                            <div>
                                                <button type="button" onClick={startWebcam} className='btn btn-secondary'>Start Webcam</button>
                                                <button type="button" onClick={captureFace} className='btn btn-secondary'>Capture Face</button>
                                                <button type="button" onClick={stopWebcam} className='btn btn-secondary'>Stop Webcam</button>
                                            </div>
                            </div>
                        <Row className="justify-content-center">
                            <Button title="Mark Attendance" onClick={onSubmit}>Mark Attendance</Button>
                        </Row>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AttendancePage;