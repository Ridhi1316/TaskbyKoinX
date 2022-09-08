const express = require('express');
const route = require('./routes/route')
const mongoose = require('mongoose');
const app = express()


app.use(express.json());

app.use('/', route);

//MongoDB connectivity
mongoose.connect("mongodb+srv://ridhi:ridhi13@cluster0.dh3hp.mongodb.net/ridhiDB", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB connection succeed"))
    .catch(err => console.log(err))

//PORT listening
app.listen(3000, () => {
    console.log('Express app running on port ' + (3000))
});


