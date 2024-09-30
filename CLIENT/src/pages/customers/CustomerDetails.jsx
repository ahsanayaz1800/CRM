// import { useEffect, useState } from "react";
// import { getCustomerById } from "../../http";
// import { useParams } from "react-router-dom"; // Import useParams
// import { Card, ListGroup, Button, Modal,Form } from 'react-bootstrap'; // Import Modal
// import { useSelector } from "react-redux";

// const CustomerDetails = () => {
//   const [selectedCustomer, setSelectedCustomer] = useState(null); // State to hold customer details
//   const [showModal, setShowModal] = useState(false); // State to control the modal visibility
//   const { customerId } = useParams(); // Get customerId from route params
//   const { user } = useSelector((state) => state.authSlice);
//   const [currentSection, setCurrentSection] = useState(0); // State to manage the current section
//   const [showDetails, setShowDetails] = useState(false); // State to manage visibility of customer details
//   const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
//   const [customerInfo, setCustomerInfo] = useState({});
//   const [notesInfo, setNotesInfo] = useState({});
//   const [transferInfo, setTransferInfo] = useState({});
//   const [cardInfo, setCardInfo] = useState([]);
//   const [bankInfo, setBankInfo] = useState([]);

//   const handleInputChange = (field, value, index) => {
//     if (currentSection === 0) {
//       setCustomerInfo(prevState => ({
//         ...prevState,
//         [field]: value,
//       }));
//     } else if (currentSection === 3) {
//       setNotesInfo(prevState => ({
//         ...prevState,
//         [field]: value,
//       }));
//     } else if (currentSection === 4) {
//       setTransferInfo(prevState => ({
//         ...prevState,
//         [field]: value,
//       }));
//     } else if (currentSection === 1) {
//       const updatedCardInfo = [...cardInfo];
//       updatedCardInfo[index] = {
//         ...updatedCardInfo[index],
//         [field]: value,
//       };
//       setCardInfo(updatedCardInfo);
//     } else if (currentSection === 2) {
//       const updatedBankInfo = [...bankInfo];
//       updatedBankInfo[index] = {
//         ...updatedBankInfo[index],
//         [field]: value,
//       };
//       setBankInfo(updatedBankInfo);
//     }
//   };


//  // Function to render fields based on section and mode
//  const renderField = (field, label, index) => {
//   const value = currentSection === 1 ? cardInfo[index][field] : currentSection === 2 ? bankInfo[index][field] : (currentSection === 0 ? customerInfo[field] : currentSection === 3 ? notesInfo[field] : transferInfo[field]);
//   return (
//     <ListGroup.Item>
//       <strong>{label}:</strong>{" "}
//       {isEditing ? (
//         <Form.Control
//           type="text"
//           value={value || ""}
//           onChange={(e) => handleInputChange(field, e.target.value, index)}
//         />
//       ) : (
//         value || "N/A"
//       )}
//     </ListGroup.Item>
//   );
// };

// const renderSection = () => {
//   if (!selectedCustomer) return <p>Loading...</p>;

//   switch (currentSection) {
//     case 0:
//       return (
//         <Card className="mt-3">
//           <Card.Header>
//             <h4>Customer Information</h4>
//           </Card.Header>
//           <Card.Body>
//             <ListGroup variant="flush">
//               {renderField("customerName", "Name")}
//               {renderField("customerEmail", "Email")}
//               {renderField("customerPhone", "Phone")}
//               {renderField("cellPhone", "Cell Phone")}
//               {renderField("address", "Address")}
//               {renderField("city", "City")}
//               {renderField("state", "State")}
//               {renderField("zipCode", "ZIP Code")}
//               {renderField("poBox", "PO Box")}
//               {renderField("ssn", "SSN")}
//               {renderField("dob", "Date of Birth")}
//               {renderField("mmm", "MMM")}
//             </ListGroup>
//           </Card.Body>
//         </Card>
//       );
  
//     case 1:
//       return (
//         <>
//           {/* Card Information */}
//           {cardInfo && cardInfo.length > 0 ? (
//             cardInfo.map((card, index) => (
//               <Card className="mt-3" key={index}>
//                 <Card.Header>
//                   <Card.Title>Card Information {index + 1}</Card.Title>
//                 </Card.Header>
//                 <Card.Body>
//                   <ListGroup variant="flush">
//                     {renderField("cardStatus", "Card Status", index)}
//                     {renderField("cardType", "Card Type", index)}
//                     {renderField("CardBankName", "Bank Name", index)}
//                     {renderField("nameOnCard", "Name on Card", index)}
//                     {renderField("cardNumber", "Card Number", index)}
//                     {renderField("expirationDate", "Expiration Date", index)}
//                     {renderField("cvc", "CVC", index)}
//                     {renderField("cardBalance", "Card Balance", index)}
//                     {renderField("available", "Available", index)}
//                     {renderField("creditLimit", "Credit Limit", index)}
//                     {renderField("lastPayment", "Last Payment", index)}
//                     {renderField("duePayment", "Due Payment", index)}
//                     {renderField("apr", "APR", index)}
//                     {renderField("tollFree", "Toll Free", index)}
//                   </ListGroup>
//                 </Card.Body>
//               </Card>
//             ))
//           ) : (
//             <p>No card information available.</p>
//           )}
//         </>
//       );
//     case 2:
//       return (
//         <>
//           {/* Bank Information */}
//           {bankInfo && bankInfo.length > 0 ? (
//             bankInfo.map((bank, index) => (
//               <Card className="mt-3" key={index}>
//                 <Card.Header>
//                   <Card.Title>Bank Information {index + 1}</Card.Title>
//                 </Card.Header>
//                 <Card.Body>
//                   <ListGroup variant="flush">
//                     {renderField("bankName", "Bank Name", index)}
//                     {renderField("accountTitle", "Account Title", index)}
//                     {renderField("accountNumber", "Account Number", index)}
//                     {renderField("BankAvailableBalance", "Available Balance ", index)}
//                     {renderField("bankTollFree", "Toll Free", index)}
                   
//                   </ListGroup>
//                 </Card.Body>
//               </Card>
//             ))
//           ) : (
//             <p>No bank information available.</p>
//           )}
//         </>
//       );
//       case 3:
//         return (
//           <Card className="mt-3">
//             <Card.Header>
//               <Card.Title>Notes Information</Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <ListGroup variant="flush">
//                 {renderField("notes", "Notes")}
//               </ListGroup>
//             </Card.Body>
//           </Card>
//         );
//       case 4:
//         return (
//           <Card className="mt-3">
//             <Card.Header>
//               <Card.Title>Transfer Information</Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <ListGroup variant="flush">
//                 {renderField("agentName", "Agent Name")}
//                 {renderField("managerName", "Manager Name")}
//               </ListGroup>
//             </Card.Body>
//           </Card>
//         );
//     default:
//       return null;
//   }
// };


//   return (
//     <div>
//       {/* Modal for displaying customer details */}
//       <Modal show={showModal} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Customer Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedCustomer ? (
//             <Card>
//               <Card.Header>
//                 <h4>Customer Information</h4>
//               </Card.Header>
//               <Card.Body>
//                 <ListGroup variant="flush">
//                   <ListGroup.Item>
//                     <strong>Name:</strong> {selectedCustomer.customerName || "N/A"}
//                   </ListGroup.Item>
//                   <ListGroup.Item>
//                     <strong>Email:</strong> {selectedCustomer.customerEmail || "N/A"}
//                   </ListGroup.Item>
//                   {/* Add more fields here */}
//                 </ListGroup>
//               </Card.Body>
//             </Card>
//           ) : (
//             <p>Loading customer details...</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default CustomerDetails;
