import mongoose from 'mongoose';

const colleccionName = 'users';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    logedBy: String,
    role:{
        type: String,
        default: 'user',
        enum : ['user', 'admin', 'premium']
    },
    carts:{
        type:[
            {
                cart:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts'
                },
            }
        ],
        default: [],
    },
    documents:{
        type:[
            {
                name: String,
                reference : String,
                status : Boolean
            },
        ]
    },
    
    last_connection:String,
    img_profile: String,
})

schema.pre('findOne', function() {
    this.populate('carts.cart');
})

const userModel = mongoose.model(colleccionName, schema);

export default userModel;