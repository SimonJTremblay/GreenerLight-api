const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    if( !email || !name || !password){
        return res.status(400).json('incorrect form submission');
    }

    var salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    // We will use a transaction because we need to update more than one thing successfully
    db.transaction(trx => {     // trx is the parameter representing the db in a transaction
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],       // first insert returned an array
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('Unable to Register.'));
    }

module.exports = {
    handleRegister: handleRegister
};