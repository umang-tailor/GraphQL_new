const constants = require("../../config/constants");
const bcrypt = require("bcryptjs");
const token = require("../../config/secret");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const models = require("../../models");

module.exports = {
  Mutation: {
    registerUser: async (parent, args, ctx) => {
      // console.log(args)
      
      try {
        console.log("registerUser function start");
        const{first_name,last_name,email,password}= args.input;
        // console.log('first_name :>> ', first_name);
        if (
          !first_name ||
          !email ||
          !password ||
          !last_name
        ) 
        {   
          throw "Please provide all Data";
        }

        let existUserData = await models.users.findOne({
          where: {
            email: email,
          },
        });

        if (existUserData) {
          throw "User with this email is already registered with us";
        }

        // let secret = token();
        var hashedPassword = await bcrypt.hash(args.input.password, 8);

        let createObject = {
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: hashedPassword,
        };

        let user = await models.users.create(createObject);

        let updatedUserData = await models.users.findOne({
          where: {
            id: user.id,
          },
        });

        // let authToken = jwt.sign({ id: user.id, role: "Users" }, secret, {
        //   expiresIn: 86400, // expires in 24 hours
        // });
        // console.log("authToken printed here", authToken);

        return{
          status: constants.success_code,
          message: "successfully created",
          data: updatedUserData,
          // token: authToken,
        };


      } catch (error) {
        console.log("error :>> ", error);
        throw error;
        
      }
    },
    login: async (parent, args, ctx) => {
      // console.log('args :>> ', args);
      console.log("login function start");
      try {
        
        if (!args.input.email || !args.input.password) {
          throw "Please provide all Data";
        }

        let user = await models.users.findOne({
          where: {
            email: args.input.email,
          },
        });

        if (!user) {
          throw "Invalid email";
        }

        var isEqual = await bcrypt.compare(args.input.password, user.password);
        console.log("!!!!!!!!!!after compare", isEqual);

        if (!isEqual) {
          throw "Invalid password";
        }

        let updatedUserData = await models.users.findOne({
          where: {
            id: user.id,
          },
        });

        let secret = token();
        let authToken = jwt.sign({ id: user.id, role: "User" }, secret, {
          expiresIn: 86400, // expires in 24 hours
        });

        // console.log(
        //   "!!!!!!!!all process completed",
        //   updatedUserData,
        //   authToken
        // );
const res={
  // status: constants.success_code,
  // message: "successfully Logged in",
  // data: updatedUserData,
  token: authToken,
}
console.log('object :>> ', res);
        return res;
      } catch (error) {
        throw error
      }
    },
    resetPassword :async (parent, args, ctx) => {
      try {
        let userPass = await models.users.findOne({
          where: {
            email: args.input.email,
          },
        });
        if (!userPass) {
          throw "invalid email";
        }
    
        let reset = {
          passwordReset: true,
          id: userPass.id,
        };
        let secret = token();
        let resetKey = jwt.sign(reset, secret, {
          expiresIn: 86400, // expires in 24 hours
        });
    
        res.json({
          status: constants.success_code,
          message: "password resetKey",
          resetKey: resetKey,
        });
      } catch (error) {
        throw 'error'
      }
    },
    updatePassword: async (parent, args, ctx) => {
    try {
        let secret = token();

        const tokenData = await jwt.decode(args.input.passwordReset, secret);
        console.log("tokenData :>> ", tokenData);
        if (tokenData.passwordReset) {
          let userFind = await models.users.findOne({
            where: {
              id: tokenData.id,
            },
          });
          if (!userFind) {
            throw "user not found";
          }
          let updateObject = {};

          updateObject.password = await bcrypt.hash(args.input.password, 8);
          let editUserData = await models.users.update(updateObject, {
            where: {
              id: tokenData.id,
            },
          });
          return {
            status: 200,
            message: "change successfully",
          };
        } else {
          return {
            status: "error",
            message: "unauthorized",
          };
        }
      }catch (error) {
        throw error
      }
    },
    changePassword : async (parent, args, ctx) => {
      console.log("start");
          try {
            if (!args.input.password) {
              throw "Please provide password";
            }
        
            let updateObject = {};
        
            updateObject.password = await bcrypt.hash(args.input.password, 8);
            // console.log("updateObject :>> ", updateObject);
            console.log(" ctx.userData.id :>> ", ctx.userData.id);
            let editUserData = await users.findOneAndUpdate(updateObject, {
              
                id: ctx.userData.id,
              
            });
            console.log("editUserData :>> ", editUserData);
            return{
              status: constants.success_code,
              message: "password change Successfully",
               
            };
          } catch (error) {
            throw error
          }
        },
  },

  Query: {
    listUsers: async (parent, args, ctx) => {
      console.log("Start");
      try {
        let result = await models.users.findAndCountAll({
          order: [["createdAt", "DESC"]],
          offset: parseInt(args.skip),
          limit: parseInt(args.limit),
        });
        // console.log("result :>> ", result);
        return{
          status: constants.success_code,
          message: "successfully listed",
          data: result.rows,
          total: result.count,
        };

      } catch (error) {
        throw error

      }
    },
  },
};

