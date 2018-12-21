const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello Docker from chromebook World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))