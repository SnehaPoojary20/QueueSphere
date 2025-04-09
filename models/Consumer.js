const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const consumerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
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
        ref:"Consumer"
    },
    joinedQueues: [
        {
            queueId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Queue',
            },
            joinedAt: {
                type: Date,
                default: Date.now,
            },
            position: {
                type: Number,
                required: true,
            },
            estimatedWaitTime: {
                type: String,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash the password before saving the consumer
consumerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare passwords for authentication
consumerSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Define the model for Consumer
const Consumer = mongoose.model('Consumer', consumerSchema);
