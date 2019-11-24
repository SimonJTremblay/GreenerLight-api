const handleMetaGetFromId = (req, res, db) => {
    const { id } = req.params;
    db.select('*')
    .from('meta')
        .join('categoriesmeta', 'meta.id', 'categoriesmeta.meta_id')
        .join('categories', 'categoriesmeta.categories_id', 'categories.id')
        .where('meta.id', '=', id)
        .then(metas => {
            if(metas[0].title.length){
                res.json(metas);
            } else {
                res.status(400).json('Not found.')
            }        
        })
        .catch(err => res.status(400).json('Error getting meta.'))
 }
 
 module.exports = {
     handleMetaGetFromId: handleMetaGetFromId
 }