import swal from "sweetalert";
import { removeMember } from "../../http";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { setFreeEmployees, setTeamMembers } from "../../store/user-slice";
import { useSelector } from "react-redux";
import { updateEmployeeCount } from "../../store/team-slice";
import { toast } from "react-toastify";
const initialState = {
    teamMembers: [],
    freeEmployees: [],  // Ensure this is always an array
    // other state variables
};
const RowMember = ({ index, data, teamId }) => {
    const { user } = useSelector(state => state.authSlice);
    const dispatch = useDispatch();
    const { teamMembers, freeEmployees } = useSelector(state => state.userSlice);
    const remove = async () => {
        console.log("Removing data:", data);
        console.log("Data ID:", data._id || data.id); // Handle both cases
        console.log("Team ID:", teamId);
    
        const id = data._id || data.id; // Determine which ID to use
    
        if (!id || !teamId) {
            toast.error("All fields are required.");
            return;
        }
    
        const payload = { userId: id, teamId: teamId };
        try {
            console.log('Sending payload:', payload);
            const res = await removeMember(payload);
            console.log('API Response:', res);
    
            if (res.status === 200) {
                toast.success(res.message);
    
                // Ensure freeEmployees is an array
                if (Array.isArray(freeEmployees)) {
                    // Log before and after state updates for debugging
                    console.log('Before state update - teamMembers:', teamMembers);
                    console.log('Before state update - freeEmployees:', freeEmployees);
    
                    // Dispatch actions after removing a member
                    dispatch(updateEmployeeCount('DECREMENT')); // Decrement count
                    dispatch(setTeamMembers(teamMembers.filter(member => member._id !== id))); // Remove from teamMembers
                    dispatch(setFreeEmployees([...freeEmployees, data])); // Add to freeEmployees
    
                    // Log after state updates
                    console.log('After state update - teamMembers:', teamMembers);
                    console.log('After state update - freeEmployees:', freeEmployees);
                } else {
                    toast.error("Error: freeEmployees is not an array.");
                }
            } else {
                toast.error(res.message || "Failed to remove member.");
            }
        } catch (error) {
            console.error("Error removing member:", error.message || error);
            toast.error(error.message || "Failed to remove member.");
        }
    };
    
    
    const showDialog = () => {
        swal({
            title: "Are you sure?",
            text: `You want to remove!\n${data.name} \nfrom this team`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((yes) => {
            if (yes) remove(); 
        });
    };

    return (
        <tr>
            <td>{index}</td>
            <td><figure className="avatar"> <img src={data.image} alt={data.name} /> </figure></td>
            <td>{data.name}</td>
            <td>{data.email}</td>
            <td>{data.mobile}</td>
            <td><div className={`badge ${data.status === 'Active' ? 'badge-primary' : 'badge-danger'}`}>{data.status}</div></td>
            {
                user.type === "Admin" ?
                (<td><button className='btn btn-danger' onClick={showDialog}><i className="fas fa-trash-alt"></i></button></td>)
                :
                (<td></td>)
            }
        </tr>
    );
};

export default RowMember;
