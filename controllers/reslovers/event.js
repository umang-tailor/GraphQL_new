const constants = require("../../config/constants");
const models = require("../../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
module.exports={
  Mutation :{

  createEvent :async (parent,args,ctx) => {
  try {
    console.log("Start",args.input.event_name);

    let createObject = {
      event_name: args.input.event_name,
      user_id: ctx.userData.id,
    };
    let event = await models.events.create(createObject,{returning: true, raw: true});
    // let createObject1 = {
    //   user_id: args.userData.id,
      
    // };
    // let event_user = await models.user_events.create(createObject1);
    console.log('event :>> ', JSON.parse(JSON.stringify(event)));
    return({
      status: constants.success_code,
      message: "successfully created",
      data: event,
    });

    
  } catch (error) {
    console.log("error :>> ", error);
    throw error
  }
},

 updateEvent : async (parent,args,ctx) => {

  try { 
    console.log(args.params.id );
    const updateObject = await models.events.update(
      {
        event_name: args.input.event_name,
      },
      { where: { user_id: ctx.userData.id, id: args.input.id } }
    );
console.log('object :>> ', updateObject);
    return({
      status: constants.success_code,
      message: "successfully updated",
      data: updateObject,
    });

  } catch (error) {
   throw error
  }
}
},
Query:{
  listEvents: async (parent,args,ctx) => {
  try {
    console.log(parent);
    let updatedUserData = await models.user_events.findAll({
      where: {
        user_id: ctx.userData.id,
      },
      include: ["event"],
    });
    // console.log('updateUserData :>> ', updatedUserData);
    if (!args.search_text) {
      let result = await models.events.findAndCountAll({
        order: [["createdAt", "DESC"]],
        offset: parseInt(args.input.skip),
        limit: parseInt(args.input.limit),
        where: {
          user_id: ctx.userData.id,
        },
        include: [
          {
            model: models.user_events,
            as: "users",
            // where: { user_id: args.userData.id },
          },
        ],
        distinct: true,
      });

      console.log("result :>> ", result);

      return({
        status: constants.success_code,
        message: "successfully listed",
        data: result.rows,
        total: result.count,
      });

      
    }
    //with search result
    let searchResult = await models.user_events.findAndCountAll({
      where: {
        user_id: ctx.userData.id,
      },
      include: [
        {
          model: models.events,
          as: "event",
          where: {
            event_name: {
              [Op.iLike]: `%${args.input.search_text}%`,
            },
          },
        },
      ],

      order: [["createdAt", "DESC"]],
      offset: parseInt(args.skip),
      limit: parseInt(args.limit),
    });
    return({
      status: constants.success_code,
      message: "successfully listed",
      data: searchResult.rows,
      total: searchResult.count,
    });
  } catch (error) {
    throw error
  }
}
  }
}

