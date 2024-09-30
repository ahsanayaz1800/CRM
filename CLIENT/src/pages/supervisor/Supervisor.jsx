import { useEffect, useState } from "react";
import HeaderSection from "../../components/HeaderSection";
import RowSupervisor from "../../components/rows/row-supervisor";
import { getSupervisors } from "../../http"; // Ensure the API call is correct

const Supervisors = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const res = await getSupervisors();
            if (res.success) {
                setUsers(res.data);
                setLoading(false);
            }
        })();
    }, []);

    return (
        <>
            <div className="main-content">
                <section className="section">
                    <HeaderSection title='Supervisors' />
                    <div className="card">
                        <div className="card-header">
                            <h4>All Supervisors</h4>
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
                                            <th>Supervising Team</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            !loading && users.map((data, index) => (
                                                <RowSupervisor key={index} index={index + 1} data={data} />
                                            ))
                                        }
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

export default Supervisors;
