import { useEffect, useState } from "react";
import HeaderSection from "../../components/HeaderSection";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { createCustomer } from "../../http";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useSelector } from "react-redux";
import { event } from "jquery";
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


const Customer1 = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cardCount, setCardCount]= useState(0)
  const { user } = useSelector((state) => state.authSlice);
  const [value, setValue]=useState('')
  const [selectedRegion, setSelectedRegion] = useState('');

  const [customerDetail, setCustomerDetail] = useState({
    customerInformation: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      cellPhone: "",
      address: "",
      city: "",
      state: "",
      region:"",
      zipCode: "",
      poBox: "",
      ssn: "",
      dob: "",
      mmm: "",
    },
    cardInformation: [{
      cardStatus: "",
      cardType: "",
      CardBankName: "",
      nameOnCard: "",
      cardNumber: "",
      expirationDate: "",
      cvc: "",
      cardBalance: "",
      available: "",
      creditLimit: "",
      lastPayment: "",
      duePayment: "",
      apr: "",
      tollFree: "",
    },],
    bankInformation: [{
      bankName: "",
      accountTitle: "",
      accountNumber: "",
      BankAvailableBalance: "",
      bankTollFree: "",
    },
  ],
    notesInformation: {
      notes: "",
    },
    transferInformation: {
      agentName:user.name,
      managerName: ""
    },
    roleInformation:{
      roleType: user.type,
      roleName: user.name
    },
    callStatus: ''
  });


  // Method to handle card changes for individual card sections
  const handleCardChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCards = [...customerDetail.cardInformation];
    updatedCards[index] = { ...updatedCards[index], [name]: value };

    setCustomerDetail({
      ...customerDetail,
      cardInformation: updatedCards,
    });
  };
  // Handle bank information change
  const handleBankChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBanks = [...customerDetail.bankInformation];
    updatedBanks[index] = { ...updatedBanks[index], [name]: value };

    setCustomerDetail({
      ...customerDetail,
      bankInformation: updatedBanks,
    });
  };

// Handle the change of selected region
const handleRegionChange = (event) => {
  setSelectedRegion(event.target.value);
};
  // Method to add a new card section
  const handleAddCard = () => {
    setCustomerDetail((prevDetail) => ({
      ...prevDetail,
      cardInformation: [
        ...prevDetail.cardInformation,
        {
          cardStatus: "",
          cardType: "",
          CardBankName: "",
          nameOnCard: "",
          cardNumber: "",
          expirationDate: "",
          cvc: "",
          cardBalance: "",
          available: "",
          creditLimit: "",
          lastPayment: "",
          duePayment: "",
          apr: "",
          tollFree: "",
        }
      ]
    }));
  };
 // Add a new bank entry
 const handleAddBank = () => {
  setCustomerDetail((prevDetail) => ({
    ...prevDetail,
    bankInformation: [
      ...prevDetail.bankInformation,
      {
        bankName: "",
        accountTitle: "",
        accountNumber: "",
        BankAvailableBalance: "",
        bankTollFree: "",
      },
    ],
  }));
};
 


  const handleExpirationDateChange = (index, e) => {
    let { value } = e.target;
    value = value.replace(/[^0-9\/]/g, "");

    if (value.length === 2 && !value.includes("/")) {
      value = value + "/";
    }

    if (value.length > 5) {
      value = value.slice(0, 5);
    }

    handleCardChange(index, { target: { name: "expirationDate", value } });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const normalizePhoneNumber = (phoneNumber) => {
    // Sanitize input by keeping only numbers and the '+' sign
    const sanitizedPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    console.log("Sanitized phone number:", sanitizedPhoneNumber); // Log sanitized input
    
    const parsedNumber = parsePhoneNumberFromString(sanitizedPhoneNumber);
    console.log("Parsed number:", parsedNumber); // Log parsed number
    
    return parsedNumber ? parsedNumber.format('E.164') : sanitizedPhoneNumber;
  };
  
  
  const handlePhoneNumberChange = (e) => {
    const { name, value } = e.target;
    const fieldPath = name.split('.');
  
    setCustomerDetail((prevState) => {
      let updatedState = { ...prevState };
      let nestedObject = updatedState;
  
      for (let i = 0; i < fieldPath.length - 1; i++) {
        nestedObject = nestedObject[fieldPath[i]];
      }
  
      console.log("Before update:", nestedObject); // Debug
      nestedObject[fieldPath[fieldPath.length - 1]] = normalizePhoneNumber(value);
      console.log("After update:", nestedObject); // Debug
  
      return updatedState;
    });
  };
  const handleStatusChange = (e) => {
    const { name, value } = e.target; // Get the name and value from the event
  
    setCustomerDetail((prevState) => {
      let updatedState = { ...prevState };
      let nestedObject = updatedState;
  
      const fieldPath = name.split('.'); // Split the name by '.' to handle nested fields
  
      for (let i = 0; i < fieldPath.length - 1; i++) {
        nestedObject = nestedObject[fieldPath[i]];
      }
  
      nestedObject[fieldPath[fieldPath.length - 1]] = value; // Update the selected dropdown value
  
      return updatedState;
    });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldPath = name.split('.');


    setCustomerDetail((prevState) => {
      let updatedState = { ...prevState };
      let nestedObject = updatedState;

      for (let i = 0; i < fieldPath.length - 1; i++) {
        nestedObject = nestedObject[fieldPath[i]];
      }

      nestedObject[fieldPath[fieldPath.length - 1]] = value;


      return updatedState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 5) {
      alert("Please complete all steps before submitting.");
      return;
    }

    try {
      const response = await createCustomer(customerDetail);
      console.log(customerDetail)
      if (response.status === 200) {
    
        alert("Customer successfully created");
      } else {
        console.log(response)
        alert("Failed to create customer");
      }
    } catch (error) {
      console.error("Error creating customer: ", error.response || error.message);
      alert("An error occurred while creating the customer");
    }
  };
 
  
  return (
    <>
      <div className="main-content">
        <section className="section">
          <HeaderSection title="Customers" />

          <div className="card">


            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <Container>
                  <div className="card-header" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                      <h4>Add Customer Information</h4>
                  </div>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Customer Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="customerInformation.customerName"
                            value={customerDetail.customerInformation.customerName}
                            onChange={handleChange}
                            placeholder="Enter Customer Name"
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Customer Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="customerInformation.customerEmail"
                            value={customerDetail.customerInformation.customerEmail}
                            onChange={handleChange}
                            placeholder="Enter Email"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Customer Phone</Form.Label>
                          <Form.Control
                            type="text"
                            name="customerInformation.customerPhone"
                            value={customerDetail.customerInformation.customerPhone}
                            onChange={handlePhoneNumberChange}
                            placeholder="Enter Phone Number"
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Cell Phone</Form.Label>
                          <Form.Control
                            type="text"
                            name="customerInformation.cellPhone"
                            value={customerDetail.customerInformation.cellPhone}
                            onChange={handleChange}
                            placeholder="Enter Cell Phone"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="customerInformation.address"
                            value={customerDetail.customerInformation.address}
                            onChange={handleChange}
                            placeholder="Enter Address"
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="customerInformation.city"
                            value={customerDetail.customerInformation.city}

                            onChange={(e) => handleChange(e, 'cutomerInformation')}
                            placeholder="Enter City"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="customerInformation.state"
                            value={customerDetail.customerInformation.state}

                            onChange={handleChange}
                            placeholder="Enter state"
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Zip Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="customerInformation.zipCode"
                            value={customerDetail.customerInformation.zipCode}

                            onChange={handleChange}
                            placeholder="Enter Zip Code"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>PO. Box</Form.Label>
                          <Form.Control
                            type="text"
                            name="customerInformation.poBox"
                            value={customerDetail.customerInformation.poBox}
                            onChange={handleChange}
                            placeholder="Enter PO. Box"
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>SSN</Form.Label>
                          <Form.Control
                            type="text"
                            name="customerInformation.ssn"
                            value={customerDetail.customerInformation.ssn}
                            onChange={handleChange}
                            placeholder="Enter SSN"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            name="customerInformation.dob"
                            value={customerDetail.customerInformation.dob}
                            onChange={handleChange}
                            placeholder="Enter Date of Birth"
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>MMM</Form.Label>
                          <Form.Control
                            type="text"
                            name="customerInformation.mmm"
                            value={customerDetail.customerInformation.mmm}
                            onChange={handleChange}
                            placeholder="Enter MMM"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                    <div className="form-group col-md-4">
      <label>Select Region</label>
      <select
        name="customerInformation.region" // Name for the dropdown
        value={customerDetail.customerInformation.region} // Value bound to state
        onChange={handleChange} // Change handler
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
                    </Row>
                    {/* Add other fields like phone, address, etc. */}
                  </Container>
                )}

       {currentStep === 2 && (
                  <Container>
                    <div
                      className="card-header"
                      style={{ width: "100%", display: "flex", justifyContent: "center" }}
                    >
                      <h4>Add Card Information</h4>
                    </div>
                  

                    {customerDetail.cardInformation.map((card, index) => (
                      <div key={index}>
                          <div
                      className="card-header"
                      style={{ width: "100%", display: "flex", justifyContent: "center" }}
                    >
                                          <h5>Card {index + 1}</h5>

                    </div>
                        <Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>Card Status</Form.Label>
                              <Form.Control
                                type="text"
                                name="cardStatus"
                                value={card.cardStatus}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="Verified"
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Card Type</Form.Label>
                              <Form.Control
                                type="text"
                                name="cardType"
                                value={card.cardType}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="Credit"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>Bank Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="CardBankName"
                                value={card.CardBankName}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="Sam's Club Master"
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Name on Card</Form.Label>
                              <Form.Control
                                type="text"
                                name="nameOnCard"
                                value={card.nameOnCard}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="Kenneth D Janzen"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>Card Number</Form.Label>
                              <Form.Control
                                type="tel"
                                name="cardNumber"
                                value={card.cardNumber}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="5213 3314 6276 0000"
                                maxLength={16}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Expiration Date (MM/YY)</Form.Label>
                              <Form.Control
                                type="text"
                                name="expirationDate"
                                value={card.expirationDate}
                                onChange={(e) => handleExpirationDateChange(index, e)}
                                placeholder="MM/YY"
                                maxLength={5}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>CVC</Form.Label>
                              <Form.Control
                                type="password"
                                name="cvc"
                                value={card.cvc}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="123"
                                maxLength={4}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Card Balance</Form.Label>
                              <Form.Control
                                type="number"
                                name="cardBalance"
                                value={card.cardBalance}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="$0.00"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>Available</Form.Label>
                              <Form.Control
                                type="number"
                                name="available"
                                value={card.available}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="$0.00"
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Credit Limit</Form.Label>
                              <Form.Control
                                type="number"
                                name="creditLimit"
                                value={card.creditLimit}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="$0.00"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>Last Payment</Form.Label>
                              <Form.Control
                                type="number"
                                name="lastPayment"
                                value={card.lastPayment}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="$0.00"
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Due Payment</Form.Label>
                              <Form.Control
                                type="number"
                                name="duePayment"
                                value={card.duePayment}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="$0.00"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>APR</Form.Label>
                              <Form.Control
                                type="number"
                                name="apr"
                                value={card.apr}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="0.00"
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Toll-Free</Form.Label>
                              <Form.Control
                                type="text"
                                name="tollFree"
                                value={card.tollFree}
                                onChange={(e) => handleCardChange(index, e)}
                                placeholder="800-555-1212"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <hr />
                      </div>
                    ))}

                    <Button onClick={handleAddCard}>Add More</Button>
                  </Container>
                )}

{currentStep === 3 && (
                  <Container>
                    <div
                      className="card-header"
                      style={{ width: "100%", display: "flex", justifyContent: "center" }}
                    >
                      <h4>Add Bank Information</h4>
                    </div>
                    {customerDetail.bankInformation.map((bank, index) => (
                      <div key={index}>
                        {/* Bank information fields */}
                        <Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>Bank Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="bankName"
                                value={bank.bankName}
                                onChange={(e) => handleBankChange(index, e)}
                                placeholder="Bank Name"
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Account Title</Form.Label>
                              <Form.Control
                                type="text"
                                name="accountTitle"
                                value={bank.accountTitle}
                                onChange={(e) => handleBankChange(index, e)}
                                placeholder="Account Title"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>Account Number</Form.Label>
                              <Form.Control
                                type="text"
                                name="accountNumber"
                                value={bank.accountNumber}
                                onChange={(e) => handleBankChange(index, e)}
                                placeholder="Account Number"
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Available Balance</Form.Label>
                              <Form.Control
                                type="text"
                                name="BankAvailableBalance"
                                value={bank.BankAvailableBalance}
                                onChange={(e) => handleBankChange(index, e)}
                                placeholder="Available Balance"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>Toll-Free</Form.Label>
                              <Form.Control
                                type="text"
                                name="bankTollFree"
                                value={bank.bankTollFree}
                                onChange={(e) => handleBankChange(index, e)}
                                placeholder="800-555-1212"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <hr />
                      </div>
                    ))}

                    <Button onClick={handleAddBank}>Add More</Button>
                  </Container>
                )}

                {currentStep === 4 && (
                  <Container>
                       <div className="card-header" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                      <h4>Add Notes</h4>
                  </div>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Notes</Form.Label>
                          <Form.Control
                            type="text"
                            name="notesInformation.notes"
                            value={customerDetail.notesInformation.notes}
                            onChange={handleChange}
                            placeholder="Enter Notes"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Container>
                )}

                {currentStep === 5 && (
                  <Container>
                       <div className="card-header" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                      <h4>Transfer Details  </h4>
                  </div>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Agent Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="transferInformation.agentName"
                            value={customerDetail.transferInformation.agentName}
                            onChange={handleChange}
                            placeholder="Enter Agent Name"
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Manager Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="transferInformation.managerName"
                            value={customerDetail.transferInformation.managerName}
                            onChange={handleChange}
                            placeholder="Enter Manager Name"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="pt-5">
                    <div className="form-group col-md-4">
                                    <label>Call Status</label>
                                    <select
  name="callStatus" // Adjust the name to match the field you want to update
  value={customerDetail.callStatus} // Bind it to the state value
  onChange={handleStatusChange} // Handle the change
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
                  </Container>
                )}

<div className="d-flex justify-content-between mt-4">
    {currentStep > 1 && (
      <Button variant="secondary" onClick={handleBack}>
        Back
      </Button>
    )}
    <div
      style={{
        marginLeft: currentStep === 1 ? 'auto' : '0', // Align to the right when currentStep is 1
        display: 'flex',
        justifyContent: 'flex-end', // Align the button to the right within the div
      }}
    >
      {currentStep < 5 ? (
        <Button variant="primary" onClick={handleNext}>
          Next
        </Button>
      ) : (
        <Button type="submit" variant="success">
          Submit
        </Button>
      )}
    </div>
  </div>

              </Form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Customer1;

  