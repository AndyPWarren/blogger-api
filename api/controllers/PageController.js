

module.exports = {

    showDashboard: function (req, res) {

//        console.log(req.session);
//        console.log(req.session.me);
//        console.log(req.session.passport);
        console.log(req.session);
        if(!req.session.authenticated) {
            console.log("load login");
            return res.view('login');
        } else {
            var user = req.session.passport.user;

            User.findOne()
                .where({id:user})
                .then(function(user){
                    if (user.admin) {
                        return res.view('dashboard');
                    } else {
                        return res.view('403');
                    }
                });

        }
    },
};
