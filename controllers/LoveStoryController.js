const LoveStory = require("../models/LoveStory");

const loveStory = (req, res) => {
	const accId = req.body.accId;
	const storyId = req.body.storyId;

	LoveStory.findOne({
		where: {
			acc_id: accId,
			story_id: storyId,
		}
	}).then(story => {
		if(story) {
			LoveStory.destroy({
				where: {
					acc_id: accId,
					story_id: storyId,
				}
			}).then(result => {
				console.log(result);
				res.status(200).json({message: "OK"});
			}).catch(err => {
				console.log(err);
				res.status(400).json({message: err});
			})
		} else {
			LoveStory.create({
				acc_id: accId,
				story_id: storyId,
			}).then(result => {
				console.log(result);
				res.status(200).json({message: "OK"});
			}).catch(err => {
				console.log(err);
				res.status(400).json({message: err});
			})
		}
	})
}

const getLoveStory = (req, res) => {
	const accId = req.body.accId;

	LoveStory.findAll({
		where: {
			acc_id: accId,
		}
	}).then(loveStory => {
		console.log(loveStory);
		res.status(200).json(loveStory);
	}).catch(err => {
		console.log(err);
		res.status(400).json(err);
	})
}

module.exports = {loveStory, getLoveStory}