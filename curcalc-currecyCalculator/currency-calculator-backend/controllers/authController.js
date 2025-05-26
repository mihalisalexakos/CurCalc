
const jwt = require("jsonwebtoken");


const defaultUser = {
  username: "username",
  password: "password"
};

// loging in
exports.login = (req, res) => {
    const { username, password } = req.body;

    // checks if credentials given by user are correct
    const isValidUser =
        username === defaultUser.username && password === defaultUser.password;

    // if info given is false, return 401 error message  
    if (!isValidUser) {
        return res.status(401).json({ message: "Credentials given are incorrect." });
    }

    // info is correct, token is sent to client(lasts one hour)
    const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    // sends token back to the client
    res.json({ token });
};