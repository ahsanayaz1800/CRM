// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerInformation: {
        customerName: { type: String, required: true },
        customerEmail: { type: String, required: true, unique: true },
        customerPhone: { type: String, required: true , unique:true},
        cellPhone: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        poBox: { type: String },
        ssn: { type: String },
        dob: { type: Date, required: true },
        mmm: { type: String }, // Assuming 'mmm' is a required field; adjust if not
        region:{ type: String}
    },
    cardInformation: [{

    
        cardStatus: { type: String },
        cardType: { type: String },
        CardBankName: { type: String },
        nameOnCard: { type: String },
        cardNumber: { type: String },
        expirationDate: { type: String },
        cvc: { type: String },
        cardBalance: { type: String },
        available: { type: String },
        creditLimit: { type: String },
        lastPayment: { type: String },
        duePayment: { type: String },
        apr: { type: String },
        tollFree: { type: String }
    
    }],
    bankInformation: [{
        bankName: { type: String },
        accountTitle: { type: String },
        accountNumber: { type: String, required: true },
        BankAvailableBalance: { type: String },
        bankTollFree: { type: String }
    }],
    notesInformation: {
        notes: { type: String }
    },
    transferInformation: {
        agentName: { type: String },
        managerName: { type: String }
    },
    roleInformation:{
        roleType:{type:String},
        roleName:{type:String}
    },
    callStatus:{
        type:String
    }
},{
    timestamps:true
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
