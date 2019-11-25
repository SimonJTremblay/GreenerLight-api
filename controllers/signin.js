const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;       //destructuring req.body
    if( !email || !password ){
        return res.status(400).json('incorrect form submission');
    }

    db.select('email', 'hash').from('login')
    .where('email', '=', email)
        .then(data => {
           // Load hash from your password DB.
            const isValid = bcrypt.compareSync(password, data[0].hash); // true
            if(isValid){
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(
                        (async function(user){
                           const permission = await getPermission(user[0].id, db);
                           user[0].permission = permission.permission;
                            res.json(user[0])
                        } )
                    )
                    .catch(err => res.status(400).json('Unable to get user.'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
}

function getPermission(id, db){
    return db.select('permission').from('permissions').where('user_id','=',id).then(permission => {return permission[0]})
}

module.exports = {
    handleSignin: handleSignin
}