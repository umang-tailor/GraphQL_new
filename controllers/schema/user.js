
const { gql } = require("apollo-server");
const typeDefs = gql`
  scalar DateTime

  directive @isAuthorized on FIELD | FIELD_DEFINITION
  directive @hasRole(role: String) on FIELD | FIELD_DEFINITION

  input InputRegisterUser{
   
    first_name:String
    last_name:String
    email:String 
    password:String
    
  }
  input UpdatePassword{
  
    email:String 
    password:String
    token:String!
  }

  input LoginInput {
    email: String!
    password: String!
}
input changePassword{
  password:String
  }

  type User {
    
    first_name: String
    last_name: String
    email: String
    password:String
    
  
  }
  type updatePassword{
    resetKey:String
    password:String
  }

  type LoginResponse{
    token:String!
  }

  input resetPassword{
    email:String
    
  }
  type ResponseUser{
    status:Int
    message:String
    data:User
  }
  type ResponseResetPassword{
    status:Int
    resetkey: String
  }
  type Query {
    listUsers: ResponseUser!
  }

  type Mutation {
    registerUser(input:InputRegisterUser): ResponseUser!
    login(input: LoginInput!): LoginResponse 
    updatePassword(input:UpdatePassword!):ResponseUser 
    changePassword(input:changePassword):ResponseUser! @isAuthorized
    resetPassword(input:resetPassword):ResponseResetPassword
  }
`;

module.exports = typeDefs;
