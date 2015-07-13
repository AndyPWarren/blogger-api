'use strict';

module.exports = {

    showDashboard: function (req, res) {


        if(!req.session.authenticated) {
            return res.view('login');
        } else {
            var user = req.session.passport.user;

            User.findOne()
                .where({id:user})
                .then(function(user){
                    if (user.admin) {
                        return res.view('dashboard');
                    } else {
                        return res.view('login');
                    }
                });

        }
    },
};
