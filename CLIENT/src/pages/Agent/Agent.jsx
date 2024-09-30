import { useEffect, useState } from "react";
import HeaderSection from "../../components/HeaderSection";
import RowAgent from "../../components/rows/row-agents"; // New Row Component for Agents
import { getAgents } from "../../http"; // Using getAgents API

const Agents = () => {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const res = await getAgents(); // Fetch agents instead of leaders
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
                    <HeaderSection title="Agents" /> {/* Changed title to Agents */}
                    <div className="card">
                        <div className="card-header">
                            <h4>All Agents</h4> {/* Adjusted the heading */}
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
                                            <th>Assigned Team</th> {/* Adjusted for Agent's team */}
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loading &&
                                            users &&
                                            users.map((data, index) => {
                                                return <RowAgent key={index} index={index + 1} data={data} />; // Changed to RowAgent
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

export default Agents;
