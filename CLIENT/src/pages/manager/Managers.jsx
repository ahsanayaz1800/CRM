import { useEffect, useState } from "react";
import HeaderSection from "../../components/HeaderSection";
import RowManager from "../../components/rows/row-managers";
import { getManagers } from "../../http";

const Managers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getManagers();
                if (res.success) {
                    setUsers(res.data);
                } else {
                    console.error('Failed to fetch managers:', res.message);
                }
            } catch (error) {
                console.error('Error fetching managers:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="main-content">
            <section className="section">
                <HeaderSection title="Managers" />
                <div className="card">
                    <div className="card-header">
                        <h4>All Managers</h4>
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
                                        <th>Leading Team</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading && users && users.map((data, index) => (
                                        <RowManager key={index} index={index + 1} data={data} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Managers;
