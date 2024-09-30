import { useEffect, useState } from "react";
import HeaderSection from "../../components/HeaderSection";
import RowVerifier from "../../components/rows/row-verifiers";
import { getVerifiers } from "../../http";

const Verifiers = () => {
    const [verifiers, setVerifiers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getVerifiers();
                if (res.success) {
                    setVerifiers(res.data);
                } else {
                    console.error('Failed to fetch verifiers:', res.message);
                }
            } catch (error) {
                console.error('Error fetching verifiers:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="main-content">
            <section className="section">
                <HeaderSection title="Verifiers" />
                <div className="card">
                    <div className="card-header">
                        <h4>All Verifiers</h4>
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
                                    {!loading && verifiers && verifiers.map((data, index) => (
                                        <RowVerifier key={index} index={index + 1} data={data} />
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

export default Verifiers;
