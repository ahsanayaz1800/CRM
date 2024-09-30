import { NavLink } from "react-router-dom";
import 'dotenv/config'

const baseUrl= process.env?.REACT_APP_BASE_URL
const RowAttendanceDetail = ({ index, data }) => {
    console.log(data,index)
    return (
        <tr>
            <td>{index}</td>
            <td>
                <figure className="avatar">
                    {" "}
                    <img src={`${baseUrl}/storage/images/profile/${data.image}`} alt={data.name} />{" "}
                </figure>
            </td>
            <td>{data.name}</td>
            <td>{data.email}</td>
            <td>{data.mobile}</td>
            <td>
                <div
                    className={`badge ${
                        data.status === "Active" ? "badge-primary" : "badge-danger"
                    }`}
                >
                    {data.status}
                </div>
            </td>
        
          
            <td>
                <NavLink to={`/admin_user_attendance/${data._id}`} className="btn btn-secondary">
                    Detail
                </NavLink>
            </td>
        </tr>
    );
};

export default RowAttendanceDetail;
