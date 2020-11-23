
// let LoginModel = require('../../models/user/login');
let bcrypt = require('bcryptjs') 
let authToken = require('../../common/jwt.auth');
let crypto = require('../../common/crypto');
let ProfileModel = require('../../models/user/profile');

class Login {
    constructor(payload, params=null) {
        this.payload = payload;
        this.params = params;    
    }

    async login() {
        try {
            let response;
            response = await ProfileModel.findOne({username: this.payload.username}).lean();
            if(response) {
                let match = await bcrypt.compare(this.payload.password, response.password);
                if(match){
                    let id = (response._id).toString()
                    let jwt_token = await authToken.encrypt({
                        user_id: id,
                        username: response.username,
                    });
                    const token = await crypto.encrypt(jwt_token);
                    return {token, response}
                } else {
                    throw new CustomError('Incorrect password.', 500 , "login");
                }
            } else {

                throw new CustomError('Invalid Username/Password', 500, 'login');
            }
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    encryptCode(res) {
        let match = bcrypt.compare(this.payload.password, res.password);
        if(match){
            // return res;
            let id = (res._id).toString();
            let jwt_token = authToken.encrypt({
                user_id: id,
                username: res.username,
            });
            const token = crypto.encrypt(jwt_token);
            return token
        } else {
            throw new CustomError('Incorrect passwordd.', 500 , "login");
        }
    }
    
}

module.exports = Login;
