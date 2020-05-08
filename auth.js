module.exports = function(passport, LocalStrategy, User) {
  passport.use(new LocalStrategy(
    async function(username, password, done) {
      try {
        let user = await User.findOne({where: { username }})
        if (!user) {
          return done(null, false)
        }
        if (user.password !== password) {
          return done(null, false)
        }
        return done(null, user)
      }
      catch (error) {
        console.log('Failed to query database')
      }
    }
  ))

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(
      async function(id, done) {
          let user = await User.findOne({where: { id }})
          done(null, user)
      }
  )
  return passport
}
