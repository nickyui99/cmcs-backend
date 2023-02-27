const Story = require("../models/Story");
const Ngo = require("../models/Ngo");
const User = require("../models/User");
const Account = require("../models/Account");
const LoveStory = require("../models/LoveStory");
const Event = require("../models/Event");

/*
This function is responsible to allow the user and NGO to create story
 */
const createStory = (req, res) => {
	console.log(req.body)
	const accId = req.body.accId;
	const content = req.body.content;
	const image = req.body.image;

	Story.create({
		acc_id: accId,
		content: content,
		image: image,
	}).then(result => {
		console.log(result)
		res.status(200).json({message: "OK"});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	});
}

/*
This function is responsible to get all the stories
 */
const getAllStories = (req, res) => {

	const accId = req.body.accId;
	const whereClause = accId ? {acc_id: accId} : {};

	Story.belongsTo(Account, {
		foreignKey: "acc_id",
		targetKey: "acc_id",
	});

	Story.hasMany(LoveStory, {
		foreignKey: "story_id",
		targetKey: "story_id"
	})

	Account.hasOne(User, {
		foreignKey: "acc_id",
		targetKey: "acc_id",
	});

	Account.hasOne(Ngo, {
		foreignKey: "acc_id",
		targetKey: "acc_id",
	});

	Story.findAll({
		where: whereClause,
		order: [
			['createdAt', "DESC"],
		],
		include: [
			{
				model: Account,
				attributes: ["acc_id", "acc_image"],
				include: [
					{
						model: User,
						attributes: ["usr_name"]
					},
					{
						model: Ngo,
						attributes: ["ngo_name"]
					}
				]
			},
			{
				model: LoveStory,
				attributes: ["acc_id"],
			}
		]
	}).then(story => {
		console.log(story);
		res.status(200).json(story);
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err})
	})
}

const getSocialProfile = (req, res) => {
	const accId = req.body.accId;

	Account.hasOne(User, {
		foreignKey: "acc_id",
		targetKey: "acc_id",
	});

	Account.hasOne(Ngo, {
		foreignKey: "acc_id",
		targetKey: "acc_id",
	});

	Ngo.hasMany(Event, {
		foreignKey: "ngo_id",
		targetKey: "ngo_id"
	})

	Account.findOne({
		attributes: ["acc_id", "acc_email", "acc_image"],
		where: {
			acc_id: accId
		},
		include: [
			{
				model: Ngo,
				required: false,
				include: [
					{
						model: Event,
						raw: true,
					}
				]
			},
			{
				model: User,
				required: false,
			}
		],
	}).then(acc => {
		console.log(acc);
		res.status(200).json({acc});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	})
}

module.exports = {createStory, getAllStories, getSocialProfile}