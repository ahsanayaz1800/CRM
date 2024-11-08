import { useEffect, useState } from "react";
import HeaderSection from "../../components/HeaderSection";
import { getAllCustomers, getCustomerById, updateCustomer } from "../../http";
import { useHistory } from "react-router-dom";
import { Card, ListGroup, Button, Form,Row } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { getCustomerByPhone } from "../../http";
const Status = {
  transfer_to_manager:" Transfer to Manager",
 call_back:"Call Back",
 cancel:"Cancel",
 close:"Close"

};
// List of regions for the dropdown
const regions = {
  Africa: 'Africa',
  Asia: 'Asia',
  Europe: 'Europe',
  'North America': 'North America',
  'South America': 'South America',
  Oceania: 'Oceania'
};

const Customer = () => {
  const [customers, setCustomers] = useState([]); // State to hold the customer data
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State to hold the selected customer details
  const [currentSection, setCurrentSection] = useState(0); // State to manage the current section
  const [showDetails, setShowDetails] = useState(false); // State to manage visibility of customer details
  const [filteredCustomers, setFilteredCustomers] = useState([]); // State for filtered customers
  const [selectedRegion, setSelectedRegion] = useState('');


  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
  const { user } = useSelector((state) => state.authSlice);
  const history = useHistory(); // Move useHistory here
  const [searchResult, setSearchResult] = useState(null);


  // Separate state for different sections
  const [customerInfo, setCustomerInfo] = useState({});
  const [notesInfo, setNotesInfo] = useState({});
  const [transferInfo, setTransferInfo] = useState({});
  const [cardInfo, setCardInfo] = useState([]);
  const [bankInfo, setBankInfo] = useState([]);
const [callStatusInfo, setCallStatusInfo] = useState(''); // Add state for call status


  // Fetch customers when the component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomers(); // Call the API to fetch customer data
        if (response.status === 200 && response.data) {
          setCustomers(response.data); // Set the data if API response is successful
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchCustomers();
  }, []);

 
  // Handle search query input change
  const handleSearchByPhone = async (phoneNumber) => {
    if (!phoneNumber.trim()) {
      console.error('Phone number is required');
      return;
    }
  
    try {
      const response = await getCustomerByPhone(phoneNumber);
      // console.log(response)
      if (response.status === 200 && response.users) {
        console.log(response)
        setSearchResult(response.users); // Update search results
         console.log(searchResult)
        setSelectedCustomer(null); // Clear selected customer
        setShowDetails(false); // Hide details view on search
      } else {
        console.error('Failed to fetch customers by phone:', response);
        setSearchResult([]); // Clear search result on failure
      }
    } catch (error) {
      console.error('Failed to fetch customers by phone:', error);
      setSearchResult([]); // Clear search result on error
    }
  };
  

  const handleSearch = async (e) => {
    const phoneNumber = e.target.value;
    console.log('Search input:', phoneNumber); // Log the phone number
    setSearchQuery(phoneNumber);
  
    if (phoneNumber.trim()) {
      await handleSearchByPhone(phoneNumber);
    } else {
      setSearchResult([]);
      setSelectedCustomer(null);
      setShowDetails(false);
    }
  };
  

  // Handle the change of selected region
const handleRegionChange = (event) => {
  setSelectedRegion(event.target.value);
};

  const HandelAddCustomer = () => {
    switch (user.type) {
      case 'Admin':
        history.push('/admin_customerinfo');
        break;
      case 'Leader':
        history.push('/leader_customerinfo');
        break;
      case 'Employee':
        history.push('/employee_customerinfo');
        break;
      case 'Supervisor':
        history.push('/supervisor_customerinfo');
        break;
      case 'Agent':
        history.push('/agent_customerinfo');
        break;
      case 'Manager':
        history.push('/manager_customerinfo');
        break;
      case 'User':
        history.push('/user_customerinfo');
        break;
      case 'Verifier':
        history.push('/verifier_customerinfo');
        break;
      case 'Advisor':
        history.push('/advisor_customerinfo');
        break;
      case 'Customer_service':
        history.push('/customer_service_customerinfo');
        break;
      case 'Junior_admin':
        history.push('/jr_admin_customerinfo');
        break;
      default:
        history.push('/employee_customerinfo'); // Default to Employee path if role is unknown
        break;
    }
  };

  const handleShowCustomer = async (id) => {
    try {
      const response = await getCustomerById(id);
      if (response.success && response.data) { // Check for the 'success' property
        setSelectedCustomer(response.data); // Update state with the fetched data
        setCustomerInfo(response.data.customerInformation || {});
        setNotesInfo(response.data.notesInformation || {});
        setTransferInfo(response.data.transferInformation || {});
        setCardInfo(response.data.cardInformation || []);
        setBankInfo(response.data.bankInformation || []);
        setCallStatusInfo(response.data.callStatus || ''); // Include call status
        setShowDetails(true); // Show customer details view
        setCurrentSection(0); // Reset section to 0 when a new customer is selected
      } else {
        console.error('Failed to fetch customer details:', response); // Log the whole response
      }
    } catch (error) {
      console.error('Failed to fetch customer details:', error);
    }
  };

  const handleCloseCustomer = () => {
    setSelectedCustomer(null); // Clear the selected customer
    setShowDetails(false); // Hide the customer details view
    setIsEditing(false); // Exit edit mode if editing
  };

  // Handle next and previous buttons
  const handleNext = () => {
    if (currentSection < 4) { // Assuming there are 5 sections (0-4)
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Function to handle updating customer info
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle input changes based on the section
  const handleInputChange = (field, value, index) => {
    if (currentSection === 0) {
      setCustomerInfo(prevState => ({
        ...prevState,
        [field]: value,
      }));
    } else if (currentSection === 3) {
      setNotesInfo(prevState => ({
        ...prevState,
        [field]: value,
      }));
    } else if (currentSection === 4) {
      setTransferInfo(prevState => ({
        ...prevState,
        [field]: value,
      }));
    } else if (currentSection === 1) {
      const updatedCardInfo = [...cardInfo];
      updatedCardInfo[index] = {
        ...updatedCardInfo[index],
        [field]: value,
      };
      setCardInfo(updatedCardInfo);
    } else if (currentSection === 2) {
      const updatedBankInfo = [...bankInfo];
      updatedBankInfo[index] = {
        ...updatedBankInfo[index],
        [field]: value,
      };
      setBankInfo(updatedBankInfo);
    }
  };

  // Handle submit action
  const handleSubmit = async () => {
    try {
      const updatedData = {
        ...selectedCustomer,
        customerInformation: customerInfo,
        notesInformation: notesInfo,
        transferInformation: transferInfo,
        cardInformation: cardInfo,
        bankInformation: bankInfo,
        roleInformation: {
          roleType: user.type,
          roleName: user.name
        },
        callStatus: callStatusInfo
      };
      await updateCustomer(selectedCustomer._id, updatedData); // Call the API with updated data
      setIsEditing(false); // Exit editing mode
      console.log('Customer updated successfully');
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  // Function to render fields based on section and mode
  const renderField = (field, label, index) => {
    const value = currentSection === 1 ? cardInfo[index][field] : currentSection === 2 ? bankInfo[index][field] : (currentSection === 0 ? customerInfo[field] : currentSection === 3 ? notesInfo[field] : transferInfo[field]);
    return (
      <ListGroup.Item>
        <strong>{label}:</strong>{" "}
        {isEditing ? (
          <Form.Control
            type="text"
            value={value || ""}
            onChange={(e) => handleInputChange(field, e.target.value, index)}
          />
        ) : (
          value || "N/A"
        )}
      </ListGroup.Item>
    );
  };

  const renderSection = () => {
    if (!selectedCustomer) return <p>Loading...</p>;

    switch (currentSection) {
      case 0:
        return (
          <Card className="mt-3">
            <Card.Header>
              <h4>Customer Information</h4>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {renderField("customerName", "Name")}
                {renderField("customerEmail", "Email")}
                {renderField("customerPhone", "Phone")}
                {renderField("cellPhone", "Cell Phone")}
                {renderField("address", "Address")}
                {renderField("city", "City")}
                {renderField("state", "State")}
                {renderField("zipCode", "ZIP Code")}
                {renderField("poBox", "PO Box")}
                {renderField("ssn", "SSN")}
                {renderField("dob", "Date of Birth")}
                {renderField("mmm", "MMM")}
                <div className="form-group col-md-4">
      <label>Select Region</label>
      <select
        name="region" // Name for the dropdown
        value={customerInfo.region} // Value bound to state
        onChange={handleRegionChange} // Change handler
        className="form-control select2" // Form styling classes
      >
        <option value="">--Select a Region--</option>
        {/* Mapping through the regions object to generate options */}
        {Object.entries(regions).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </div>
              </ListGroup>
            </Card.Body>
          </Card>
        );
    
      case 1:
        return (
          <>
            {/* Card Information */}
            {cardInfo && cardInfo.length > 0 ? (
              cardInfo.map((card, index) => (
                <Card className="mt-3" key={index}>
                  <Card.Header>
                    <Card.Title>Card Information {index + 1}</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      {renderField("cardStatus", "Card Status", index)}
                      {renderField("cardType", "Card Type", index)}
                      {renderField("CardBankName", "Bank Name", index)}
                      {renderField("nameOnCard", "Name on Card", index)}
                      {renderField("cardNumber", "Card Number", index)}
                      {renderField("expirationDate", "Expiration Date", index)}
                      {renderField("cvc", "CVC", index)}
                      {renderField("cardBalance", "Card Balance", index)}
                      {renderField("available", "Available", index)}
                      {renderField("creditLimit", "Credit Limit", index)}
                      {renderField("lastPayment", "Last Payment", index)}
                      {renderField("duePayment", "Due Payment", index)}
                      {renderField("apr", "APR", index)}
                      {renderField("tollFree", "Toll Free", index)}
                    </ListGroup>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No card information available.</p>
            )}
          </>
        );
      case 2:
        return (
          <>
            {/* Bank Information */}
            {bankInfo && bankInfo.length > 0 ? (
              bankInfo.map((bank, index) => (
                <Card className="mt-3" key={index}>
                  <Card.Header>
                    <Card.Title>Bank Information {index + 1}</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      {renderField("bankName", "Bank Name", index)}
                      {renderField("accountTitle", "Account Title", index)}
                      {renderField("accountNumber", "Account Number", index)}
                      {renderField("BankAvailableBalance", "Available Balance ", index)}
                      {renderField("bankTollFree", "Toll Free", index)}
                     
                    </ListGroup>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No bank information available.</p>
            )}
          </>
        );
        case 3:
          return (
            <Card className="mt-3">
              <Card.Header>
                <Card.Title>Notes Information</Card.Title>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {renderField("notes", "Notes")}
                </ListGroup>
              </Card.Body>
            </Card>
          );
        case 4:
          return (
            <Card className="mt-3">
              <Card.Header>
                <Card.Title>Transfer Information</Card.Title>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {renderField("agentName", "Agent Name")}
                  {renderField("managerName", "Manager Name")}
                </ListGroup>
                <Row className="pt-5">
                    <div className="form-group col-md-4">
                                    <label>Call Status</label>
                                    <select
  name="callStatus" // Adjust the name to match the field you want to update
  value={callStatusInfo} // Bind it to the state value
  onChange={(e)=>setCallStatusInfo(e.target.value)} // Handle the change
  className="form-control select2"
>
  {Object.entries(Status).map(([key, value]) => (
    <option key={key} value={key}>
      {value}
    </option>
  ))}
</select>
                                </div>

                    </Row>


                
              </Card.Body>
            </Card>
          );
      default:
        return null;
    }
  };
  
  
  
  return (
    <>
      <div className="main-content">
        <section className="section">
          <HeaderSection title="Customers" />

          <div className="card">
          <div
              className="card-header"
              style={{ width: "100%", display: "flex", justifyContent: "space-between" }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
                style={{ width: "300px" }}
              />

            
            </div>
            <div
              className="card-header"
              style={{ width: "100%", display: "flex", justifyContent: "space-between" }}
            >
              <h4>All Customers</h4>
              <button
                className="btn btn-primary"
                onClick={HandelAddCustomer}
              >
                Add Customer
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
              {searchQuery ? (
            <>
              {searchResult && searchResult.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Bank Name</th>
                      <th>Card Name</th>
                      <th>City</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  {/* <tbody>
                    {searchResult.map((customer, index) => (
                      <tr key={customer._id}>
                        <td>{index + 1}</td>
                        <td>{customer.customerInformation.customerName}</td>
                        <td>{customer.bankInformation[0]?.bankName || 'N/A'}</td>
                        <td>{customer.cardInformation[0]?.nameOnCard || 'N/A'}</td>
                        <td>{customer.customerInformation.city}</td>
                        <td>
                          <Button
                            variant="info"
                            onClick={() => handleShowCustomer(customer._id)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody> */}
                  <tbody>


    {searchResult.map((customer, index) => (
      <tr key={customer._id}>
        <td>{index + 1}</td>
        <td>{customer.customerInformation.customerName}</td>
        <td>{customer.bankInformation[0]?.bankName || 'N/A'}</td>
        <td>{customer.cardInformation[0]?.nameOnCard || 'N/A'}</td>
        <td>{customer.customerInformation.city}</td>
        <td>
          <Button
            variant="info"
            onClick={() => handleShowCustomer(customer._id)}
          >
            View Details
          </Button>
        </td>
      </tr>
    ))};
</tbody>
                </table>
              ) : (
                <p>No search results found.</p>
              )}
            </>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Bank Name</th>
                  <th>Card Name</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
           <tbody>

   {customers.map((customer, index) => (
      <tr key={customer._id}>
        <td>{index + 1}</td>
        <td>{customer.customerInformation.customerName}</td>
        <td>{customer.bankInformation[0]?.bankName || 'N/A'}</td>
        <td>{customer.cardInformation[0]?.nameOnCard || 'N/A'}</td>
        <td>{customer.customerInformation.city}</td>
        <td>
          <Button
            variant="info"
            onClick={() => handleShowCustomer(customer._id)}
          >
            View Details
          </Button>
        </td>
      </tr>
    ))};

</tbody>
            </table>
          )}
              
              </div>
            </div>
          </div>

          {showDetails && (selectedCustomer || searchResult) && (
            <div className="customer-details">
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <Button
                  variant="danger"
                  onClick={handleCloseCustomer}
                  className="mb-3"
                >
                  Close
                </Button>
                {isEditing ? (
                    <Button onClick={handleSubmit}>Submit</Button>
                  ) : (
                    <Button onClick={handleEdit}>Edit</Button>
                  )}

              </div>
              {renderSection()}
              <div className="navigation-buttons mt-3" style={{display:"flex", justifyContent:'space-between'}}>
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={currentSection === 0}
                  
                 
                >
                  Previous
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={currentSection === 4} // Adjust based on the number of sections
                  hidden={currentSection===4}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Customer;
