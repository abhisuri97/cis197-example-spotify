# cis197-example-spotify
example spotify api usage for class

NOTE: you will need to create a `config.js` file on the root directory containing your spotify client_id client_secret, and callbackURL

```
module.exports = {
  client_id: 'spotifyclientid',
  client_secret: 'spotifyclientsecret',
  callback_URL: 'http://localhost:3000/auth/spotify/callback'
}
```

## Demo

!['demo']('demo.gif')

To run use `node app.js`. You will also need mongod running in the background
