const handleCategoriesGet = (req, res, db) => {
   db.select('*').from('categories')
    .then(categories => {
        if(categories[0].title.length){
            res.json(categories);
        } else {
            res.status(400).json('Not found.')
        }        
    })
    .catch(err => res.status(400).json('Error getting categories.'))
}

const handleCategoriesAndMetaGet = (req, res, db) => {

    //  found answer on: https://www.reddit.com/r/node/comments/aexin9/nesting_data_from_database_queries_with_joins_for/
    //  using postgreSQL aggregate functions

        db.select('C.id', 'C.title', db.raw("array_agg(json_build_object('id',meta.id,'title',meta.title)) as metas"))

        .join('categoriesmeta as cm', 'cm.categories_id' , '=', 'C.id')
        .join('meta', 'cm.meta_id','=','meta.id')
        
        .from("categories as C")
        
        .groupBy("C.id")
        .then(response => {
            if(response[0].title.length){
                res.json(response) 
            } else {
                res.status(400).json('Not found.')
            }
        })
        .catch(err => res.status(400).json('Error getting categories/meta.'))
}
        

module.exports = {
    handleCategoriesGet: handleCategoriesGet,
    handleCategoriesAndMetaGet: handleCategoriesAndMetaGet
}