import express from "express";
import User from "../models/User";
import {Error} from "mongoose";
import {imagesUpload} from "../multer";

const userRouter = express.Router();


userRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).send({ error: 'This username is already registered.' });
        }

        const user = new User({
            username: req.body.username,
            password: req.body.password,
            displayName: req.body.displayName,
            active: true,
        });

        user.generateToken();

        await user.save();
        return res.send({ user: user });
    } catch (error) {
        return next(error);
    }
});

userRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});

        if(!user) {
            return res.status(422).send({error: 'User not found!'});
        }

        const isMatch = await user.checkPassword(req.body.password);

        if(!isMatch) {
            return res.status(422).send({error: 'Password is wrong!'});
        }

        user.active = true;
        user.generateToken();
        await user.save();

        return res.send({message: 'Username and password are correct!', user});
    } catch (e) {
        next(e);
    }
});

userRouter.delete('/sessions', async (req, res, next) => {
    try {
        const token = req.get('Authorization');
        const success = {message: 'Success'};

        if (!token) return res.send(success);

        const user = await User.findOne({token});

        if (!user) return res.send(success);

        user.active = false;
        user.generateToken();
        user.save();

        return res.send(success);
    } catch (e) {
        return next(e);
    }
});


export default userRouter;