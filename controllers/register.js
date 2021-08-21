const handleRegister = (req, res, db, bcrypt) => { //kto parametrat i kemi dhe tek serveri
	const { email, name, password } = req.body; //kto jan pytjet ne body
	if (!email || !name || !password) { // nese jan bosh japin true dhe return kte posht
		return res.status(400).json('incorrect form submission'); // i shtojn return qe pjesa posht mos ti japi run
	}
	const hash = bcrypt.hashSync(password); //kjo e ben passwordin bcryptet te koduar
	db.transaction(trx => { // kjo bohet qe te kemi nje kalim te dhenash nga nje tabel ne tjt. ne rastin ton nga register ne login
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trex('users')
			    .returning('*') // kjo trregon qe kthen te gjitha kollonat e tabeles
				.insert({ //krijojm nje statemnt lart per te futur userat kur ata rregjistrohen
					email: loginemail[0],// e shtojm array qe mos tna dali me kllapa emaili ne database
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]); //kjo kap userin e funit q rregjistorhet
		    })
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
    .catch(err => res.status(400).json('unable to register')); //kjo esht per me kap erroret
}

module.exports = {
	handleRegister: handleRegister
}