import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isUrl, getLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8080;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage",async (req:express.Request, res:express.Response) => {
    const image_url = req.query.image_url;

    if(!image_url || image_url==0){
      return res.status(422)
        .send({message: "Please provide a parameter, like this ?image_url=https://photos.mandarinoriental.com/is/image/MandarinOriental/new-york-2017-columbus-circle-01?wid=2880&hei=1280&fmt=jpeg&crop=6,1064,4928,2190&anchor=2032,2134&qlt=75,0&op_sharpen=0&resMode=sharp2&op_usm=0,0,0,0&iccEmbed=0&printRes=72&fit=crop"});
    }
    if(!isUrl(image_url)){
      return res.status(400)
        .send({message: `Please provide valid url, instead of: ${image_url}`});
    }

    const filtered_path = await filterImageFromURL(image_url);

    return res.status(200).sendFile(filtered_path, () => {
      deleteLocalFiles(getLocalFiles());
      console.info("File deleted.")
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req:express.Request, res:express.Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();