const Express = require("express")
const Router = Express.Router()
const Logins = require('../controllers/logins')

Router.post("/admin/login", Logins.login)
Router.post("/admin/logout", Logins.logout)

module.exports = Router