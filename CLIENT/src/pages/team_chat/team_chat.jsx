import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderSection from "../../components/HeaderSection";
import RowTeamChat from "../../components/rows/row-team-chat";
import axios from "axios";
import { getTeamChats } from "../../http";
const TeamChat = () => {
  const { user } = useSelector((state) => state.authSlice);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
 const userId= user.id
  // Fetch teams from the backend
  const fetchTeams = async () => {
    try {
      const response = await getTeamChats(userId);
      setTeams(response.data);
      console.log('Teams after fetch:', response.data); // Log the updated teams
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTeams(); // Call fetchTeams when the component mounts
  }, []);

  return (
    <>
      <div className="main-content">
        <section className="section">
          <HeaderSection title="Teams" />
          <div className="card">
            <div className="card-header">
              <h4>{user.name} Teams</h4>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-md center-text">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading &&
                      teams &&
                      teams.map((team, index) => (
                        <RowTeamChat key={index} index={index + 1} data={team} />
                      ))}
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

export default TeamChat;
