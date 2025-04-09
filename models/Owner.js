const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Owner"
    },
    businessName: {
        type: String,
        required: true,
        trim: true,
    },
    businessCategory: {
        type: String,
        required: true,
        enum: ['Hospital', 'Store', 'Salon', 'Service', 'Other'], // Predefined categories
        default: 'Other',
    },
    businessLocation: {
        type: String,
        required: true,
        trim: true,
    },
    businessDescription: {
        type: String,
        trim: true,
    },
    queues: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Queue', // Reference to the Queue model
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    media:{
        type:String,
        default:"",
        
    },
  
});

// Hash the password before saving the owner
ownerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare passwords for authentication
ownerSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Define the model for Owner
const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;
