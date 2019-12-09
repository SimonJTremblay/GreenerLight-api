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

        .leftJoin('categoriesmeta as cm', 'cm.categories_id' , '=', 'C.id')
        .leftJoin('meta', 'cm.meta_id','=','meta.id')
        
        .from("categories as C")
        .where('C.state', 1)    // 1 = active, 2 = pending, 3= rejected
        
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

const handleCategoriesPendingPost = (req, res, db) => {
    const { title } = req.body;
    if( !title){
        return res.status(400).json('incorrect form submission');
    }
    db('categories')
        .returning(['id', 'title'])
        .insert({title: title})
        .then(data => {
           return res.json(data);
        })
        .catch(err => res.status(400).json('Unable to insert data.'));
}


const handleCategoriesPendingGet = (req, res, db) => {
    db.select('*').from('categories').where('state', 2)
     .then(categories => {
         if(categories[0].title.length){
             res.json(categories);
         } else {
             res.status(400).json('Not found.')
         }        
     })
     .catch(err => res.status(400).json('Error getting categories.'))
 }
 
 const handleCategoriesDecisionPut = (req, res, db) => {
    const { id, state } = req.body;
    db('categories')
        .where({id: id})
        .update({state: state},['id','title','state'])
     .then(answer => {
         res.json(answer);       
     })
     .catch(err => res.status(400).json('Error updating categories.'))
 } 

module.exports = {
    handleCategoriesGet: handleCategoriesGet,
    handleCategoriesAndMetaGet: handleCategoriesAndMetaGet,
    handleCategoriesPendingPost: handleCategoriesPendingPost,
    handleCategoriesPendingGet: handleCategoriesPendingGet,
    handleCategoriesDecisionPut: handleCategoriesDecisionPut,
}