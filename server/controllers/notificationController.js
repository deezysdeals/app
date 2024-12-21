import asyncHandler from 'express-async-handler'; 
import Notification from '../models/Notification.js'; 


/**
 * GET ALL NOTIFICATIONS
 */ 
const getNotifications = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const notifications = await Notification.find({ deleted_at: null, user: req?.user_id })
                                            .sort('-created_at')
                                            .skip(skip)
                                            .limit(limit)
                                            .populate({
                                                path: 'order'
                                            })
                                            .lean(); 
    if (!notifications?.length) return res.status(404).json({ message: "No notifications found!" }); 

    const total = await Notification.countDocuments({ deleted_at: null }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: notifications 
            });
}); 

/**
 * READ NOTIFICATION
 */
const readNotification = asyncHandler (async (req, res) => {
    const { id } = req?.params; 

    const notification = await Notification.findOne({ _id: id }).exec();

    if (!notification) return res.status(404).json({ message: `No notification matches the notification ${id}!` }); 

    notification.read = true; 
    notification.read_at = new Date().toISOString(); 

    notification.save()
        .then(() => { 
			res.status(200).json({ success: `Notification read.`, data: notification });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
});

/**
 * SOFT-DELETE A NOTIFICATION
 */
const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const notification = await Notification.findOne({ _id: id }).exec();

    if (!notification) return res.status(404).json({ message: `No notification matches the notification ${id}!` }); 

    if (notification.deleted_at == '' || notification.deleted_at == null) {
        notification.deleted_at = new Date().toISOString();
        notification.deleted_by = req?.user_id;
    }

    notification.save()
        .then(() => { 
			res.status(200).json({ success: `Notification record deleted.`, data: notification });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * RESTORE A SOFT-DELETED NOTIFICATION
 */
const restoreNotification = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const notification = await Notification.findOne({ _id: id }).exec();

    if (!notification) return res.status(404).json({ message: `No notification matches the notification ${id}!` }); 

    if (notification.deleted_at != '' && notification.deleted_at != null) {
        notification.deleted_at = '';
        notification.deleted_by = '';
    };

    notification.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted notification record restored.`, data: notification });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * PERMANENTLY DELETE A NOTIFICATION
 */
const destroyNotification = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const notification = await Notification.findOne({ _id: id }).exec();

	if (!notification) return res.status(404).json({ message: `No notification matches the notification ${id}!` }); 

	await notification.deleteOne(); 

	res.status(200).json({ success: `Notification ${notification?._id} has been permanently deleted.`, data: `${notification}` });
}); 



export { getNotifications, 
        readNotification,
        deleteNotification, 
        restoreNotification, 
        destroyNotification }; 