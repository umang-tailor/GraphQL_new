const {gql}=require("apollo-server")
const typeDefs = gql`


scalar DateTime

directive @isAuthorized on FIELD | FIELD_DEFINITION
directive @hasRole(role: String) on FIELD | FIELD_DEFINITION

input InputInviteUser{
    event_id:Int
    user_id:Int
   
}

type event{
    event_name:String
}


type eventUser{
    id:Int
    event_name:String!
    event_id:Int
    user_id:Int
    data:[event]    
}
type ResponseUserDetail{
    data:[eventUser]
    
}

type Mutation {
    userInvite(input:InputInviteUser): eventUser! @isAuthorized
   
}

type Query{
    userDetail:ResponseUserDetail! @isAuthorized
}
`
module.exports = typeDefs;