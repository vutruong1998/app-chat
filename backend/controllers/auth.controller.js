import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
    const data = req.body;
    
    const user = await User.findOne({ email: data.email });
    
    if (!user) {
        res.render('auth/login');
    }

    const checkPassword = await bcrypt.compare(data.password, user.password);
    
    if (checkPassword == true) {
        req.session.name = await user.name;
        res.redirect('/');
    }
}

export const logout = async (req, res) => {
    req.session.destroy(null);
    res.render('auth/login');
}