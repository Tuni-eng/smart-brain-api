const handleSignin = ( db, bcrypt) => (req, res) =>{ //kjo trregon qe pasi kalojm db dhe bcrypt , kalojm ne rquest dhe response
	const { email, password } = req.body; //kto jan pytjet ne body
	if (!email || !password) { // nese jan bosh japin true dhe return kte posht
		return res.status(400).json('incorrect form submission'); // i shtojn return qe pjesa posht mos ti japi run
	}
	db.select('email', 'hash').from('login')
	.where('email', '=', email)
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash)
		console.log(isValid);
		if (isValid) {
			return db.select('*').from('users')
			.where('email', '=', email)
			.then(user => {
				console.log(user)
				res.json(user[0])
			})
			.catch(err => res.status(400).json('unable to get user'))
		} else {
			res.status(400).json('wrong credentials')
		}
	})
	.catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
	handleSignin: handleSignin
}