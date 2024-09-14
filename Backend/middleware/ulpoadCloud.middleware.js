
// import upload cloud 
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

// cloudinary config
cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret
});
// end cloudinary config

module.exports.upload = (req, res, next) => {
    if(req.file){
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                    if (result) {
                      resolve(result);
                    } else {
                      reject(error);
                    }
                  }
                );
    
              streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            req.body[req.file.fieldname] =  result.url // req.file.fieldname ::: name of image  
            next();
        }
    
        upload(req);
    }
    else{
        next();
    }
}