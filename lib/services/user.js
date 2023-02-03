'use strict';

const { Service } = require('@hapipal/schmervice'); 
const iut_encrypt = require('@fraginox/iut-encrypt');
const Jwt = require('@hapi/jwt');

module.exports = class UserService extends Service {

        async create(user){

            const { User } = this.server.models();
            
            user.password = await iut_encrypt.hash(user.password);

            return User.query().insertAndFetch(user);
        }

        getAll() {
            
            const { User } = this.server.models();
        
            return User.query().select();
        }

        async delete(request){

            const { User } = this.server.models();
            const { id } = request.payload;

            await User.query().deleteById(id);
        } 

        async edit(user) {

            const { User } = this.server.models();
            if (user.password) {
                user.password = await iut_encrypt.hash(user.password);
            }
            await User.query().patch(user).findById(user.id);
        }

        async login(creditentials) {
            const { User } = this.server.models();
            
            const user = await User.query().findOne({mail : creditentials.mail});
            if (user) {
                const isRightPassword = await iut_encrypt.compare(creditentials.password, user.password);
                if (isRightPassword) {
                     return Jwt.token.generate(
                        {
                            aud: 'urn:audience:iut',
                            iss: 'urn:issuer:iut',
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.mail,
                            scope: user.role
                        },
                        {
                            key: 'this_is_my_key', // La clé qui est définit dans lib/auth/strategies/jwt.js
                            algorithm: 'HS512'
                        },
                        {
                            ttlSec: 14400 // 4 hours
                        }
                    );
                }
            }
            // return 401 Unauthorized à laplace
            return { error: "Problem encountered while login" }
        }
}
