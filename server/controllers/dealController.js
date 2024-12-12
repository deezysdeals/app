import asyncHandler from 'express-async-handler'; 
import slug from 'slug';
const slugIt = slug; 
import User from '../models/User.js'; 
import Deal from '../models/Deal.js'; 


const getDeals = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 

    const skip = (current_page - 1) * limit; 

	const deals = await Deal.find({ deleted_at: null })
                            .sort('-created_at')
                            .skip(skip)
                            .limit(limit)
                            .populate({
                                path: 'user_specifically_for',
                                select: 'first_name last_name username'
                            })
                            .populate({
                                path: 'user',
                                select: 'first_name last_name username'
                            })
                            .lean(); 
    if (!deals?.length) return res.status(404).json({ message: "No deals found!" }); 

    const total = await Deal.find({ deleted_at: null }).countDocuments();

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: deals 
            });
});

const createDeal = asyncHandler(async (req, res) => {
    const { code, 
            title, 
            description, 
            value, 
            value_unit, 
            specific_for_user, 
            user_specifically_for, 
            usable_once } = req?.body; 

    console.log(req?.body); 

    const userFound = await User.findOne({ username: user_specifically_for }).lean();

    async function createDealFunction() {
        try {
            const deal = await Deal.create({
                user: req?.user_id, 
                code, 
                title, 
                slug: slugIt(title + '-' + new Date().toISOString() ),
                description, 
                value, 
                value_unit: (value_unit == 'undefined') ? 'usd' : value_unit, 
                specific_for_user, 
                user_specifically_for: userFound?._id, 
                usable_once 
            });
            res.status(201).json({ success: `Deal ${deal._id} added`, data: deal });
        } catch (error) {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        }
    }

    createDealFunction();
}); 

const getDeal = asyncHandler(async (req, res) => { 
    const { id } = req?.params;
	const deal = await Deal.findOne({ _id: id })
		.select(['-created_at', '-updated_at', '-deleted_at'])
		.lean();

	if (!deal) return res.status(404).json({ message: `No deal matches deal ${req?.params?.id}!` });
	res.status(200).json({ data: deal });
}); 

const updateDeal = asyncHandler(async (req, res) => {
    const { code, 
            title, 
            description, 
            value, 
            value_unit, 
            specific_for_user, 
            user_specifically_for, 
            usable_once } = req?.body; 

    const { id } = req?.params; 

    const deal = await Deal.findOne({ _id: id }).exec();
    if (!deal) return res.status(404).json({ message: "Deal not found!" }); 

    if (code) deal.code = code; 
    if (title) deal.title = title; 
    if (description) deal.description = description; 
    if (value) deal.value = value; 
    if (value_unit) deal.value_unit = value_unit; 
    if (specific_for_user) deal.specific_for_user = specific_for_user; 
    if (user_specifically_for) deal.user_specifically_for = user_specifically_for; 
    if (usable_once) deal.usable_once = usable_once; 

    deal.save()
        .then(() => { 
			res.status(200).json({ success: `Deal record updated.`, data: deal });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const deleteDeal = asyncHandler(async (req, res) => { 
    const { id } = req?.params; 

    const deal = await Deal.findOne({ _id: id }).exec();

    if (!deal) return res.status(404).json({ message: `No deal matches the deal ${id}!` }); 

    if (deal.deleted_at == '') {
        deal.deleted_at = new Date().toISOString();
        deal.deleted_by = req?.user_id;
    }

    deal.save()
        .then(() => { 
			res.status(200).json({ success: `Deal record deleted.`, data: deal });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const restoreDeal = asyncHandler(async (req, res) => { 
    const { id } = req?.params; 

    const deal = await Deal.findOne({ _id: id }).exec();

    if (!deal) return res.status(404).json({ message: `No deal matches the deal ${id}!` }); 

    if (deal.deleted_at != '') {
        deal.deleted_at = '';
        deal.deleted_by = '';
    }

    deal.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted deal record restored.`, data: deal });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const destroyDeal = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const deal = await Deal.findOne({ _id: id }).exec();

	if (!deal) return res.status(404).json({ message: `No deal matches the deal ${id}!` }); 

	await deal.deleteOne(); 

	res.status(200).json({ success: `Deal ${deal?.code} has been permanently deleted.`, data: `${deal}` });
}); 


export { getDeals, 
		createDeal, 
		getDeal, 
		updateDeal, 
		deleteDeal, 
        restoreDeal, 
        destroyDeal }; 