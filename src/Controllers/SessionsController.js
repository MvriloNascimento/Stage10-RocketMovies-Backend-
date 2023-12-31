const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const knex = require("../database/knex");
const AppError = require("../Utils/AppError");
const AuthConfig = require("../configs/auth");

class SessionsController {
    async create(request, response) {
        const { email, password } = request.body;

        const user = await knex("users").where({ email }).first();

        if (!user) {
            throw new AppError("Incorrect email and/or password", 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError("Incorrect email and/or password", 401);
        }

        const { secret, expiresIn } = AuthConfig.jwt;
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })


        return response.json({ user, token })
    }

}

module.exports = SessionsController;