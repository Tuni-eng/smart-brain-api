const Clarifai = require ('clarifai') //kjo kalohet ne back end qe te mos e shofin userat

const app = new Clarifai.App({
  apiKey:"e6a9027bc8184c658f759e19740f6fa2"
});

const handleApiCall = (req, res) => { //kjo bohet const dhe meret
 app.models
    .predict(  Clarifai.FACE_DETECT_MODEL,req.body.input) //clarifai pra esht key qe kshu deklarohen gjithmon me key para
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {  //put esh menyr me bo update gjona
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
    	res.json(entries[0]);  
    })
    .catch(err => rex.statis(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall

}