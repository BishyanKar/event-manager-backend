// let SignupModel = require('../../models/user/signup');
let ProfileModel = require('../../models/user/profile');

let bcrypt = require('bcryptjs');
const saltRounds = 10;


class Signup {
    constructor(payload, params=null) {
        this.payload = payload; 
        this.params = params;    
    }

    async signup() {
        try {
            let response;
            let today = new Date();

            response = await ProfileModel.findOne({username: this.payload.username}).lean();
            if(response) {
                throw new CustomError('Username exists.', 500, 'signup');
            } else {
                if(this.payload.password === this.payload.retype_password) {
                    let encrypted_password = bcrypt.hashSync(this.payload.password, saltRounds);
                    let obj = {
                        username: this.payload.username,
                        authID: this.payload.authID,
                        password: encrypted_password,
                        country: this.payload.country,
                        state: this.payload.state,
                        city: this.payload.city,
                        gender: this.payload.gender,
                        first_name : this.payload.first_name,
                        last_name: this.payload.last_name,
                        age: this.payload.age,
                        creation_date : today,
                        isAdmin: false
                    }
                    let newUser = await ProfileModel.create(obj);
                    if(newUser) {
                        return {
                            success: true,
                            newUser 
                        }
                    } else{
                        throw new CustomError('Something went wrong.', 500, 'signup');
                    }
                } else {
                    throw new CustomError('Passwords do not match.', 500, 'signup');
                }
            }        
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    
}

module.exports = Signup;
