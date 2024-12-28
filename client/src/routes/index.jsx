const routeNames = {

    /** Auth Routes */ 
    'sign-up': '/sign-up', 
    'sign-up-as-enteprise': '/sign-up-as-enteprise', 
    'verify-email': '/verify-email/:username/:token', 
    'sign-in': '/sign-in', 
    'passwordless-signin': '/passwordless-signin/:username/:token', 
    'passwordless-signin-request': '/passwordless-signin-request', 
    'password-reset': '/password-reset/:username/:token', 
    'password-reset-request': '/password-reset-request', 


    /** Private Routes */ 
    'home.admin.show': '/home/admin/:username/show', 
    'home.admin.edit': '/home/admin/:username/edit', 
    'home.admin.index': '/home/admin', 

    'home.brands.show': '/home/brands/:id/show', 
    'home.brands.edit': '/home/brands/:id/edit', 
    'home.brands.create': '/home/brands/create', 
    'home.brands.index': '/home/brands', 

    'home.clients.show': '/home/clients/:username/show', 
    'home.clients.edit': '/home/clients/:username/edit', 
    'home.clients.index': '/home/clients', 

    'home.deals.show': '/home/deals/:id/show', 
    'home.deals.edit': '/home/deals/:id/edit', 
    'home.deals.create': '/home/deals/create', 
    'home.deals.index': '/home/deals', 

    'home.deliveries.edit': '/home/deliveries/:id/edit', 
    'home.deliveries.index': '/home/deliveries', 

    'home.favorites.show': '/home/favorites/:id/show', 
    'home.favorites.edit': '/home/favorites/:id/edit', 
    'home.favorites.index': '/home/favorites', 

    'home.invoices.show': '/home/invoices/:id/show', 
    'home.invoices.index': '/home/invoices', 

    'home.market.show': '/home/market/:id/show', 
    'home.market.index': '/home/market', 

    'home.notifications.index': '/home/notifications', 
    
    'home.order-items.edit': '/home/order-items/:id/edit', 
    'home.order-items.index': '/home/ordered-items', 
    
    'home.orders.show': '/home/orders/:id/show', 
    'home.orders.edit': '/home/orders/:id/edit', 
    'home.orders.index': '/home/orders', 

    'home.payments.index': '/home/payments', 

    'home.products.edit': '/home/products/:id/edit', 
    'home.products.create': '/home/products/create', 
    'home.products.index': '/home/products', 

    'home.profile.index': '/home/profile', 

    'home.profit.index': '/home/profit', 

    'home.purchases.edit': '/home/purchases/:id/edit', 
    'home.purchases.create': '/home/purchases/create', 
    'home.purchases.index': '/home/purchases', 

    'home.ratings.index': '/home/ratings', 

    'home.sales.index': '/home/sales', 

    'home.settings.index': '/home/settings', 

    'home.site-configurations.index': '/home/site-configurations', 

    // 'home.social-media.show': '/home/social-media/:id/show', 
    'home.social-media.edit': '/home/social-media/:id/edit', 
    'home.social-media.tiktok': '/home/social-media/tiktok', 
    'home.social-media.twitter-x': '/home/social-media/twitter-x', 
    'home.social-media.index': '/home/social-media', 

    'home.users.show.orders': '/home/users/:username/orders', 
    'home.users.show.ordered-items': '/home/users/:username/ordered-items', 
    'home.users.show.payments': '/home/users/:username/payments', 
    'home.users.show.product-reviews': '/home/users/:username/product-reviews', 
    'home.users.show.deliveries': '/home/users/:username/deliveries', 
    'home.users.show.purchases': '/home/users/:username/purchases', 
    'home.users.show.client-queries': '/home/users/:username/client-queries', 
    'home.users.show.query-responses': '/home/users/:username/query-responses', 

    'home.users.show': '/home/users/:username/show', 
    'home.users.edit': '/home/users/:username/edit', 
    'home.users.index': '/home/user-management', 

    'home.index': '/home', 


    /** Public Routes */ 
    'brands.show': '/brands/:id/show', 
    'brands.index': '/brands', 

    'deals.show': '/deals/:id/show', 
    'deals.index': '/deals', 

    'categories.show': '/categories/:id/show', 
    'categories.index': '/categories/:source', 

    'cart': '/cart', 
    'paid': '/paid', 
    'pay': '/pay', 
    'order-placed': '/order-placed', 

    'products.show': '/products/:source/:id/show', 
    'products.index': '/products/:source', 

    'trending': '/trending', 

    'index': '/'
} 

function route(name, params = {}) {
    let url = routeNames[name] 

    for (let prop in params) {
        if (Object?.prototype?.hasOwnProperty?.call(params, prop)) {
            url = url?.replace(`:${prop}`, params[prop])
        }
    } 

    return url;
} 


export { route }