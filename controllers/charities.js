const handleCharitiesGet = (req, res, db) => {
    db.select('*').from('charities')
     .then(charities => {
         if(charities[0].name.length){
             res.json(charities);
         } else {
             res.status(400).json('Not found.')
         }        
     })
     .catch(err => res.status(400).json('Error getting charities.'))
 }

 module.exports ={
    handleCharitiesGet: handleCharitiesGet
 }