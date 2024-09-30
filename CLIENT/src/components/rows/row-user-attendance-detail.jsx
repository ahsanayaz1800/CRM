import { NavLink } from "react-router-dom";
import 'dotenv/config'

const baseUrl = process.env?.REACT_APP_BASE_URL;

const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);

    // Extract the date in day-month-year format
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Months are zero-indexed
    const year = dateObj.getFullYear();
    
    return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
};

const formatTime = (timestamp) => {
    const dateObj = new Date(timestamp);

    // Extract the time and convert to 12-hour format
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format, adjust for 0 hour

    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

const RowUserAttendanceDetail = ({ index, data }) => {
    const formattedDate = formatDate(data.timestamp);
    const formattedTime = formatTime(data.timestamp);

    return (
        <tr>
            <td>{index}</td>
            <td>{data.name}</td>
            <td>{data.email}</td>
            <td>{data.attendanceStatus}</td>
            <td>{formattedTime}</td> {/* Show the formatted time */}
            <td>{formattedDate}</td> {/* Show the formatted date */}
        </tr>
    );
};

export default RowUserAttendanceDetail;
