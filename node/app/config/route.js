const Express = require("express")
const Router = Express.Router()
const Logins = require('../controllers/logins')
const traffics = require('../controllers/traffics')

Router.post("/admin/login", Logins.login)
Router.post("/admin/logout", Logins.logout)
Router.get("/admin/traffic", traffics.traffic)

module.exports = Router