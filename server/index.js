require('dotenv/config');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Driveways = require('./models/driveways.js');
const routes = require('./routes')

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API
})
const app = express();
app.use(bodyParser.json());

// connect to db
mongoose.connect(process.env.MONGO_URL, (err, db) => {
  if(err) console.error(err);
  
  console.log("connected to database");
});

// grabs the lat long
// googleMapsClient.geocode({address: '91755'}, (err, response) => {
//     if(!err) console.log(response.json.results[0].geometry.location)
    
//     const coords = response.json.results[0].geometry.location;

//     Driveways.aggregate(
//       [
//         {
//           $geoNear: {
//             near: {
//               type: 'Point',
//               coordinates: [parseFloat(coords.lng), parseFloat(coords.lat)]
//             },
//             maxDistance: parseFloat(8050),
//             spherical: true,
//             distanceField: 'dist'
//           }
//         }
//       ], (err, result) => {
//         if(err) return res.status(500).send(err);

//         res.send(JSON.stringify(result));
//       }
//     )
//   }
// );




app.use(express.static(path.join(__dirname +'./../'))); //serves the index.html
app.use(bodyParser.json())

routes(app)

app.post('/searchAddress', (req, res) => {
  // find the address
  // check whether it's a valid address search using google maps?
  // get the result back from google maps and search the 'address' through
  // the db and return back the result...whether it being empty...an array of objects..or one object?
  console.log(req.body);
  Driveways.find(req.body, (error, data) => {
    console.log('inside find', data);
    if(error) return res.status(500).send(error);
    
    res.status(200).json(data);
  })
})

app.listen(3000, () => {
  console.log('Listening on 3000...');
})