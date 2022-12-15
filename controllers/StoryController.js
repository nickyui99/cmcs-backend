const Story = require("../models/Story");
const Ngo = require("../models/Ngo");
const User = require("../models/User");
const Account = require("../models/Account");
const LoveStory = require("../models/LoveStory");
const {loveStory} = require("./LoveStoryController");


const createStory = (req, res) => {
	console.log(req.body)
	const accId = req.body.accId;
	const content = req.body.content;
	const image = req.body.image;

	Story.create({
		acc_id: accId,
		content: content,
		image: image,
		created_at: new Date()
	}).then(result => {
		console.log(result)
		res.status(200).json({message: "OK"});
	}).catch(err => {
		console.log(err);
		res.status(400).json({message: err});
	});
}

const getAllStories = (req, res) => {

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
		order: [
			['created_at', "DESC"]
		],
		include: [
			{
				model: Account,
				required: true,
				include: [
					{
						model: User
					},
					{
						model: Ngo
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

module.exports = {createStory, getAllStories}