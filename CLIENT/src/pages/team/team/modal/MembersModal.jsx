import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../../../http'; // Import your API function
import Modal from '../../../../components/modal/Modal';
import RowAddMember from '../../../../components/rows/row-add-member';

const MembersModal = ({ close }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let isMounted = true; // Flag to track if component is mounted

    useEffect(() => {
      const fetchUsers = async () => {
        console.log("Fetching users...");
        try {
          const response = await getAllUsers();
          console.log("Full API Response:", response);
      
          const data = response.data || response; // Adjust based on response structure
          console.log("Parsed Data:", data);
      
          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            throw new Error('Unexpected data format');
          }
        } catch (error) {
          setError(`Failed to fetch users: ${error.message}`);
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      };
      
        fetchUsers();

        return () => {
            isMounted = false; // Cleanup function to set flag to false on unmount
        };
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Modal close={close} title="Add Member">
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
  {users.length > 0 ? (
    users.map((user, index) => (
      <RowAddMember key={user._id} index={index + 1} data={user} />
    ))
  ) : (
    <tr><td colSpan="7">No users found</td></tr>
  )}
</tbody>

            </table>
        </Modal>
    );
}

export default MembersModal;
