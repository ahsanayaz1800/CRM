import { useEffect, useState } from "react";
import HeaderSection from "../../components/HeaderSection";
import { useParams } from "react-router-dom";
import { getAttendance, getAttendanceByDate } from "../../http"; // Import both APIs
import RowUserAttendanceDetail from "../../components/rows/row-user-attendance-detail";
import { Parser } from "json2csv"; // Import json2csv parser

const UserAttendanceDetail = () => {
    const [userRecord, setUserRecord] = useState([]); // Stores the attendance data
    const [loading, setLoading] = useState(true); // Loading state
    const { id } = useParams(); // Gets the user ID from the route params
    const [fromDate, setFromDate] = useState(''); // From date for filtering
    const [toDate, setToDate] = useState(''); // To date for filtering
    const [isFiltered, setIsFiltered] = useState(false); // State to track whether filtering is applied

    // Fetch all attendance data initially
    const fetchAllAttendance = async () => {
        setLoading(true);
        const res = await getAttendance(id); // Fetch all attendance
        setUserRecord(res.data); // Set the attendance data
        setLoading(false); // Stop the loading spinner
    };

    // Fetch filtered attendance data
    const fetchFilteredAttendance = async (from, to) => {
        setLoading(true);
        const res = await getAttendanceByDate(id, from, to); // Fetch attendance based on date range
        setUserRecord(res.data); // Set the filtered attendance data
        setLoading(false); // Stop the loading spinner
    };

    // Fetch all data on initial load
    useEffect(() => {
        fetchAllAttendance(); // Load all records when the component mounts
    }, []);

    // Handle filter button click
    const handleFilter = () => {
        if (fromDate && toDate) {
            fetchFilteredAttendance(fromDate, toDate); // Fetch filtered data
            setIsFiltered(true); // Mark that filtering is applied
        }
    };

 // Format Date Function
const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`; // Ensure the return format is consistent
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

    // Function to convert data to CSV and trigger download
    const exportToCSV = () => {
        const formattedRecords = userRecord.map(record => {
            const formattedDateValue = formatDate(record.timestamp); // Format date
            const formattedTimeValue = formatTime(record.timestamp); // Format time

            return {
                name: record.name,
                email: record.email,
                attendance_status: record.attendanceStatus,
                time: formattedTimeValue,
                date: formattedDateValue,
            };
        });

        const fields = ['name', 'email', 'attendance_status', 'time', 'date']; // Specify fields to include in the CSV
        const opts = { fields };

        try {
            const parser = new Parser(opts); // Create a new json2csv parser with the specified fields
            const csv = parser.parse(formattedRecords); // Parse formattedRecords into CSV format

            // Create a blob and download the CSV file
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `attendance_${isFiltered ? "filtered" : "all"}.csv`);
            document.body.appendChild(link); // Append link to the body
            link.click(); // Trigger download
            document.body.removeChild(link); // Remove link after download
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="main-content">
                <section className="section">
                    <HeaderSection title="Attendance" />
                    <div className="card">
                        <div className="card-header row">
                            <div className="col-7">
                                <h4>Details</h4>
                            </div>
                            {/* Date filters */}
                            <div className="date-filter col-5" style={{ alignItems: 'center', justifyContent: 'left' }}>
                                <label htmlFor="fromDate">From:</label>
                                <input
                                    type="date"
                                    id="fromDate"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                                <label htmlFor="toDate">To:</label>
                                <input
                                    type="date"
                                    id="toDate"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={handleFilter}>
                                    Filter
                                </button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-striped table-md center-text">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Attendance Status</th>
                                            <th>Time</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loading && userRecord && userRecord.map((data, index) => (
                                            <RowUserAttendanceDetail key={index} index={index + 1} data={data} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button className="btn btn-success" onClick={exportToCSV}>
                                Export to CSV
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default UserAttendanceDetail;
