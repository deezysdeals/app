import cloudinaryImageUpload from '../../config/imageUpload/cloudinary.js'; 
import asyncHandler from 'express-async-handler'; 
import SiteConfiguration from '../../models/SiteConfiguration.js'; 


const getSiteConfigurations = asyncHandler(async (req, res) => {
    // const configurations = await SiteConfiguration.findOne({ initial_setup: true }).lean(); 
    let configurations = await SiteConfiguration.findOne({ initial_setup: true }).exec();

    if (!configurations) return res.status(404).json({ message: "No site configurations found" }); 

    res.json({ data: configurations });
}); 


const createSiteConfigurations = asyncHandler(async (req, res) => { 
    const configurationExists = await SiteConfiguration.find().lean(); 

    if (configurationExists?.length) return res.status(409).json({ message: 'Initial setup is in place.' }); 

    const newConfiguration = new SiteConfiguration({
        initial_setup: true
    }); 

    newConfiguration.save()
                .then(() => {
                    res.status(201).json({ success: `Favorite ${favorite._id} added`, data: favorite });
                })
                .catch((error) => {
                    if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
                });
}); 


const createUpdateSiteConfigurations = asyncHandler(async (req, res) => {
    const { homepage_hero_text_1_heading, 
            homepage_hero_text_1_content,
            homepage_hero_text_2_heading, 
            homepage_hero_text_2_content,  
            homepage_product_review_hero, 
            homepage_product_review_footer_1, 
            homepage_product_review_footer_2, 
            homepage_product_review_footer_3 } = req?.body; 

    const { homepage_hero_image_path, 
            homepage_footer_image_path } = req?.files;

    console.log('Received files:', req?.files); // Log files for debugging

    if (!req?.files || !homepage_hero_image_path) {
        return res.status(400).json({ message: 'Hero image is missing' });
    }

    let configurations = await SiteConfiguration.findOne({ initial_setup: true }).exec();

    // if (!configurations) {
    //     configurations = new SiteConfiguration({
    //         initial_setup: true
    //     });
    // }

    // Hero image upload
    if (homepage_hero_image_path) {
        try {
            let heroImageUpload = await cloudinaryImageUpload(homepage_hero_image_path.tempFilePath, "deezysdeals_site_images");
            console.log('Hero image upload result:', heroImageUpload); // Debug log
            if (!heroImageUpload) {
                return res.status(400).json({ message: "Hero image upload failed" });
            }
            configurations.homepage_hero_image_path.public_id = heroImageUpload?.public_id;
            configurations.homepage_hero_image_path.url = heroImageUpload?.secure_url;
        } catch (error) {
            return res.status(500).json({ message: "Error uploading hero image", details: error.message });
        }
    }

    // Footer image upload
    if (homepage_footer_image_path) {
        try {
            let footerImageUpload = await cloudinaryImageUpload(homepage_footer_image_path.tempFilePath, "deezysdeals_site_images");
            console.log('Footer image upload result:', footerImageUpload); // Debug log
            if (!footerImageUpload) {
                return res.status(400).json({ message: "Footer image upload failed" });
            }
            configurations.homepage_footer_image_path.public_id = footerImageUpload?.public_id;
            configurations.homepage_footer_image_path.url = footerImageUpload?.secure_url;
        } catch (error) {
            return res.status(500).json({ message: "Error uploading footer image", details: error.message });
        }
    }

    // Updating other fields in configurations
    if (homepage_hero_text_1_heading) configurations.homepage_hero_text_1_heading = homepage_hero_text_1_heading;
    if (homepage_hero_text_1_content) configurations.homepage_hero_text_1_content = homepage_hero_text_1_content;
    if (homepage_hero_text_2_heading) configurations.homepage_hero_text_2_heading = homepage_hero_text_2_heading;
    if (homepage_hero_text_2_content) configurations.homepage_hero_text_2_content = homepage_hero_text_2_content;
    if (homepage_product_review_hero) configurations.homepage_product_review_hero = homepage_product_review_hero;
    if (homepage_product_review_footer_1) configurations.homepage_product_review_footer_1 = homepage_product_review_footer_1;
    if (homepage_product_review_footer_2) configurations.homepage_product_review_footer_2 = homepage_product_review_footer_2;
    if (homepage_product_review_footer_3) configurations.homepage_product_review_footer_3 = homepage_product_review_footer_3;

    // Save the configurations
    try {
        await configurations.save();
        res.status(200).json({ success: 'Site configurations updated.' });
    } catch (error) {
        res.status(400).json({ message: "An error occurred!", details: error.message });
    }
});



export { getSiteConfigurations, createSiteConfigurations, createUpdateSiteConfigurations }; 