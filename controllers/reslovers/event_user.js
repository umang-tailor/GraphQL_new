const constants = require("../../config/constants");

const models = require("../../models");
const { where } = require("sequelize");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;


module.exports = {
  Mutation:{
userInvite : async (parent,args,ctx) => {
  try {
    let user = await models.users.findOne({
      where: {
        email: args.input.email,
      },
    });

    if (!user) {
      throw "Invalid email";
    }
    console.log("user :>> ", user);
    let event = await models.events.findOne({
      where: {
        id: args.input.event_id,
      },
    });
    if (!event) {
      throw "Invalid id";
    }
    console.log("event :>> ", event);

    let userExits = await models.user_events.findOne({
      where: {
        user_id: user.id,
        event_id: args.input.event_id,
      },
    });
    console.log("userExits :>> ", userExits);
    if (userExits) {
      throw "Already invited";
    }
    if (ctx.userData.id == event.user_id) {
      let createObject = {
        user_id: user.id,
        event_id: args.input.event_id,
      };
      let event_user = await models.user_events.create(createObject);
      console.log(event_user);
      return({
        status: constants.success_code,
        message: "successfully created",
        data: event_user,
      });
    }
  } catch (error) {
    console.log("error :>> ", error);
throw error
  }
},
  },
  Query:{
userDetail : async (parent,args,ctx) => {
  try {
    // console.log("start");
    if (!req.body.search_text) {
      let result = await models.user_events.findAll({
        // order: [["createdAt", "DESC"]],
        // offset: parseInt(req.body.skip),
        // limit: parseInt(req.body.limit),
        where: {
          user_id: ctx.userData.id,
        },
        include: [
          {
            model: models.events,
            as: "event",
            // where: { user_id: args.userData.id },
          },
        ],
        distinct: true,
      });

      //   console.log("result :>> ", result);

      return({
        status: constants.success_code,
        message: "successfully listed",
        data: result,
      });

    }
    //with search result
    // let searchResult = await models.user_events.findAndCountAll({
    //   where: {
    //     user_id: args.userData.id,
    //   },
    //   include: [
    //     {
    //       model: models.events,
    //       as: "event",
    //       where: {
    //         event_name: {
    //           [Op.ilike]: `%${args.body.search_text}%`,
    //         },
    //       },
    //     },
    //   ],

    //   order: [["createdAt", "DESC"]],
    //   offset: parseInt(args.body.skip),
    //   limit: parseInt(args.body.limit),
    // });
    // res.json({
    //   status: constants.success_code,
    //   message: "successfully listed",
    //   data: searchResult.rows,
    //   total: searchResult.count,
    // });

    return;
  } catch (error) {
    console.log("error :>> ", error);
   throw error
  }
}
  }
}

