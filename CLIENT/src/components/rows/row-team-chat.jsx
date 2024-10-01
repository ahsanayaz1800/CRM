import { useHistory } from "react-router-dom";
import Chat from "../../pages/chat/chat";
import { useSelector } from "react-redux";
const RowTeamChat = ({index,data}) =>
{
    const history = useHistory();
    const { user } = useSelector(state => state.authSlice);

    // Handler for navigating to the chat page
    const handleChatClick = () => {
      // Navigate to the Chat component, passing teamId and userId as route state
      history.push("/chat", { teamId: data._id,userId: user.id});
      console.log(data._id, user.id)
    };
  
    return(
        <tr>
            <td>{index}</td>
            <td><figure className="avatar"> <img src={data.image} alt={data.name}/> </figure></td>
            <td>{data.name}</td>
         
            <td><div className={`badge ${data.status==='active' ? 'badge-primary' :'badge-danger'}`}>{data.status}</div></td>
            <td className="btn btn-secondary" onClick={handleChatClick}>
        Chat
      </td>
        </tr>
    );
}

export default RowTeamChat;