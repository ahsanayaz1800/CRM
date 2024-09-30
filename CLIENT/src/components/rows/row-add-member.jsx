import { useSelector } from "react-redux";
import swal from 'sweetalert';
import { toast } from "react-toastify";
import { addMember } from "../../http";
import { useDispatch } from "react-redux";
import { setFreeEmployees, setTeamMembers } from "../../store/user-slice";
import { updateEmployeeCount } from "../../store/team-slice";

const RowAddMember = ({ index, data }) => {
  const { team } = useSelector((state) => state.teamSlice);
  const { freeEmployees, teamMembers } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();

  const add = async () => {
    if (!data._id) { // Change here from `data.id` to `data._id`
      console.error("Data ID is missing");
      toast.error("Invalid data ID");
      return;
    }

    const payload = { userId: data._id, teamId: team.id }; // Change here from `data.id` to `data._id`
    console.log("Sending payload:", payload);
    try {
      const res = await addMember(payload);
      if (res.success) {
        toast.success(res.message);
        removeMemberFromStore(data._id); // Change here from `data.id` to `data._id`
      } else {
        toast.error(res.message || "Failed to add member.");
      }
    } catch (error) {
      console.error("Error adding member:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to add member.");
    }
  };

  const removeMemberFromStore = (id) => {
    dispatch(setFreeEmployees(freeEmployees.filter((item) => item._id !== id))); // Change here from `data.id` to `id`
    dispatch(setTeamMembers([...teamMembers, data]));
    dispatch(updateEmployeeCount('INCREMENT'));
  };

  const showDialog = () => {
    swal({
      title: "Are you sure?",
      text: `You want to add!\n${data.name} \ninto this team`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((yes) => {
      if (yes) add();
    });
  };

  return (
    <tr>
      <td>{index}</td>
      <td><figure className="avatar"><img src={data.image} alt={data.name} /></figure></td>
      <td>{data.name}</td>
      <td>{data.email}</td>
      <td>{data.mobile}</td>
      <td><div className={`badge ${data.status === 'active' ? 'badge-primary' : 'badge-danger'}`}>{data.status}</div></td>
      <td><button className='btn btn-success' onClick={showDialog}><i className="fas fa-plus"></i></button></td>
    </tr>
  );
};

export default RowAddMember;
