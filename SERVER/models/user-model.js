const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    socketId: {
        type: String,
        default: null
      }, 
    name:{
        type:String,
        required:true,
        minlength:4,
        maxlength:25,
        trim:true
    },
    email:{
        type:String,
        required:[true,'Enter Email Address'],
        unique:[true,'Email Already Exist'],
        trim:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not a valid email'
        }
    },
    username:{
        type:String,
        required:true,
        unique:true,
        minlength:4,
        maxlength:15,
        trim:true
    },
    cnic:{
        type:String,
        unique:true,
        trim:true
    },
    relativeName:{
        type:String,
    },
    relativePhone:{
        type:String,

    },
    relativeRelation:{
        type:String,
    },
    permissions: {
        type: [String],
        enum: ['Manage Customer', 'Manage User', 'Manage Team'],
        default: []
    },

    mobile:{
        type:Number,
        required:true,
        minlength:10,
        maxlength:13,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    type:{
        type:String,
        enum: [
            'admin', 'agent', 'leader', 'supervisor', 'manager', 'team lead',
            'user', 'verifier', 'advisor', 'customer_service', 'junior_admin'
        ]
    },
    status:{
        type:String,
        enum:['active','banned'],
        default:'active'
    },
    team:[{
        type:Schema.Types.ObjectId,
        ref:'Team'
    }],
    image:{
        type:String,
        required:false,
        default:'user.png'
    },
    faceData:{
        type:String,
        required:true,
        default:'user.png'
    },
    address:{
        type:String,
        default:'No Address Specified',
        maxlength:100,
        trim:true
    }
    
},{
    timestamps:true
});

// const SALT_FACTOR = process.env.BCRYPT_PASSWORD_SALT_FACTOR || 10;
const SALT_FACTOR = 10


// userSchema.path('password').validate(
//     console.log('calling')
// )


userSchema.pre('save',function(done){
    const user = this;
    if(!user.isModified('password'))
        return done();

    bcrypt.genSalt(SALT_FACTOR,(err,salt)=>{
        if(err){
            console.log(err);
            return done(err);
        }
        bcrypt.hash(user.password,salt,(err,hashedPassword)=>
        {
            if(err)
                return done(err);
            user.password = hashedPassword;
            return done();
        });
    });
});


userSchema.pre('updateOne',function(done){
    const user = this.getUpdate();
    if(!user.password)
        return done();
    bcrypt.genSalt(SALT_FACTOR,(err,salt)=>
    {
        if(err)
            return done(err);
        bcrypt.hash(user.password,salt,(err,hashedPassword)=>
        {
            if(err) return done(err);
            user.password = hashedPassword;
            return done();
        });
    });
});

module.exports = new mongoose.model('User',userSchema,'users');