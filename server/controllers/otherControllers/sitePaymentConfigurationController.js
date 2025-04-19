import asyncHandler from 'express-async-handler'; 
import SitePaymentConfiguration from '../../models/SitePaymentConfiguration.js';


const getSitePaymentConfigurations = asyncHandler(async (req, res) => {
    // const configurations = await SiteConfiguration.findOne({ initial_setup: true }).lean(); 
    let paymentConfigurations = await SitePaymentConfiguration.findOne({ initial_setup: true });

    if (!paymentConfigurations) return res.status(404).json({ message: "No site payment configurations found" }); 

    res.json({ data: paymentConfigurations });
}); 

/**
 * ADD PROFIT SETTINGS
 */
const createUpdateSitePaymentConfiguration = asyncHandler(async (req, res) => {
    const { type, unit } = req?.body;

    const foundPaymentConfiguration = await SitePaymentConfiguration.findOne({ initial_setup: true })

    if (!foundPaymentConfiguration) {
        await SitePaymentConfiguration.deleteMany({});

        const newSitePaymentConfiguration = new SitePaymentConfiguration({
            type, 
            unit, 
            initial_setup: true
        }); 

        newSitePaymentConfiguration.save()
                                    .then(() => { 
                                        res.status(200).json({ success: `Payment Configuration created..`, data: newSitePaymentConfiguration });
                                    })
                                    .catch((error) => {
                                        if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
                                    });

    } else {
        if (type) foundPaymentConfiguration.type = type; 
        if (unit) foundPaymentConfiguration.unit = unit; 

        foundPaymentConfiguration.save()
                                .then(() => { 
                                    res.status(200).json({ success: `Payment Configuration updated..`, data: foundPaymentConfiguration });
                                })
                                .catch((error) => {
                                    if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
                                });
    };
});


export { getSitePaymentConfigurations, createUpdateSitePaymentConfiguration }