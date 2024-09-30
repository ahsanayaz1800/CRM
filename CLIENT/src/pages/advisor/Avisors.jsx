import { useEffect, useState } from "react";
import HeaderSection from "../../components/HeaderSection";
import RowAdvisor from "../../components/rows/row-advisors";
import { getAdvisors } from "../../http";

const Advisors = () => {
    const [advisors, setAdvisors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getAdvisors();
                if (res.success) {
                    setAdvisors(res.data);
                } else {
                    console.error('Failed to fetch advisors:', res.message);
                }
            } catch (error) {
                console.error('Error fetching advisors:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="main-content">
            <section className="section">
                <HeaderSection title="Advisors" />
                <div className="card">
                    <div className="card-header">
                        <h4>All Advisors</h4>
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
                                    {!loading && advisors && advisors.map((data, index) => (
                                        <RowAdvisor key={index} index={index + 1} data={data} />
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

export default Advisors;
