const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

//define the user schema
const UserShema = new mongoose.Schema({
    username:{type:String, required: true, unique: true},
    password:{type:String, required: true}
});


//pre-save 
UserShema.pre('save', function 
() { if (this.isNew || this.isModified('password'))
{
    const document = this;
    bcrypt.hash(document.password, repeatHash,(err, hashedPassword)=>{
        if(err){
            next(err);
        } else{
            document.password = hashedPassword;
            next();
        }
    } );
}else{
    next();
}  
});

UserShema.methods.isCorrectPassword = async function(password) {
    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            return callback(err, same);
        } else {
            callback(err, same);
        }
    });
};


module.exports = mongoose.model('User', UserShema);