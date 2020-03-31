const AWS = require('aws-sdk');

export default () => {

    const s3 = new AWS.S3({
        accessKeyId: process.env.AMAZON_BUCKET_SECRET_ID,
        secretAccessKey: process.env.AMAZON_BUCKET_SECRET_KEY,
    });

    return {
        createBucket(bucketName: string) {

            const params = {
                Bucket: bucketName,
                CreateBucketConfiguration: {
                    // Set your region here
                    LocationConstraint: process.env.AMAZON_BUCKET_REGION,
                }
            };

            s3.createBucket(params, function(err, data) {
                if (err) console.log(err, err.stack);
                else console.log('Bucket Created Successfully', data.Location);
            });

        },
        uploadImg(img: string, fileName: string) {

            // Ensure that you POST a base64 data to your server.
            // Let's assume the variable "base64" is one.
            // @ts-ignore
            const base64Data = new Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64');

            // Getting the file type, ie: jpeg, png or gif
            const type = img.split(';')[0].split('/')[1];

            return new Promise((resolve, reject) => {

                const params = {
                    Bucket: process.env.AMAZON_BUCKET_NAME,
                    Key: `${fileName}.${type}`, // type is not required
                    Body: base64Data,
                    ACL: 'public-read',
                    ContentEncoding: 'base64', // required
                    ContentType: `image/${type}`, // required. Notice the back ticks
                }

                // Uploading files to the bucket
                s3.upload(params, function(err, data) {

                    if (err) {
                        reject(err);
                    }

                    console.log('data: ', data);
                    console.log('data: ', data.Location);

                    resolve(data.Location);

                });

            })

        },
    }

}

// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const aws = require('aws-sdk');

// export default () => {

//     aws.config.update({
//         // Your SECRET ACCESS KEY from AWS should go here,
//         // Never share it!
//         // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
//         secretAccessKey: process.env.AMAZON_BUCKET_SECRET_KEY,
//         // Not working key, Your ACCESS KEY ID from AWS should go here,
//         // Never share it!
//         // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
//         accessKeyId: process.env.AMAZON_BUCKET_SECRET_ID,
//         region: process.env.AMAZON_BUCKET_REGION, // region of your bucket
//     });

//     const s3 = new aws.S3();

//     return multer({
//         storage: multerS3({
//             s3,
//             bucket: process.env.AMAZON_BUCKET_NAME,
//             acl: 'public-read',
//             metadata: function (req, file, cb) {
//                 cb(null, {fieldName: file.fieldname});
//             },
//             key: function (req, file, cb) {
//                 cb(null, Date.now().toString())
//             }
//         })
//     });

// }

