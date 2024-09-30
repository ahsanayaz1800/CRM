import { useEffect, useState } from "react";
import HeaderSection from "../../components/HeaderSection";
import { getAllUsers } from "../../http"; // Using getAgents API
import RowAttendanceDetail from "../../components/rows/row-attendance-details";
const AttendanceDetail = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const res = await getAllUsers(); // Fetch agents instead of leaders
            console.log(res)
            setUsers(res);
            setLoading(false);
            console.log(users)
            if (res.success) {
            }
        })();
    }, []);

    return (
        <>
            <div className="main-content">
                <section className="section">
                    <HeaderSection title="Attendance" /> {/* Changed title to Agents */}
                    <div className="card">
                        <div className="card-header">
                            <h4>All Users</h4> {/* Adjusted the heading */}
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-striped table-md center-text">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Mobile</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loading &&
                                            users &&
                                            users.map((data, index) => {
                                                return <RowAttendanceDetail key={index} index={index + 1} data={data} />; // Changed to RowAgent
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AttendanceDetail;
