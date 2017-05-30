module.exports = {
    // show the home page
    showHome: (req, res) => {
        res.render('pages/home')
        /*TODO implement with if-else*/
    },

    // show the contact page
    showContact: (req, res) => {
        res.render('pages/contact')
    },

};