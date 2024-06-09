import AWS from 'aws-sdk';

const accessKey = process.env.AWS_ACCESS_KEY as string;
const secretKey = process.env.AWS_SECRET_KEY as string;
const region = process.env.AWS_REGION as string;

AWS.config.update({ 
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    region:region,
});

declare global{
    var s3 : AWS.S3 | undefined;
}

function generateS3(){
    if(process.env.NODE_ENVIRONMENT === 'development'){
        if(!globalThis.s3){
            console.log("Generating S3 object in local!!")
            globalThis.s3 = new AWS.S3();
        }
        return globalThis.s3;
    }
    else{
        console.log("Generating S3 object in production!!");
        return new AWS.S3();
    }
}

export const s3 = generateS3();

