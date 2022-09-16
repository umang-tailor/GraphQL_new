const {gql}=require("apollo-server")
const typeDefs = gql`


scalar DateTime

directive @isAuthorized on FIELD | FIELD_DEFINITION
directive @hasRole(role: String) on FIELD | FIELD_DEFINITION

input createInput{

  event_name:String!
}

input updateEvent{
    id:Int
    event_name:String!
}
    
type event{
    
    event_name:String
    
}


type user {
    user_id:Int
}


type CreateEventResponse {
    status: String
    message: String
    data: event
}


type Mutation {
    createEvent(input:createInput): CreateEventResponse! @isAuthorized
    updateEvent(input:updateEvent):CreateEventResponse! @isAuthorized
}

type Query{
    listEvents:CreateEventResponse! @isAuthorized
}

`
module.exports = typeDefs;