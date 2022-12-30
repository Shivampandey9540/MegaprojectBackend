import s3 from "../config/s3";

export const s3fileUploade = async ({ bucketName, key, body, contentType }) => {
  return await s3
    .upload({
      Bucket: bucketName,
      key: key,
      Body: body,
      ContentType: contentType,
    })
    .promise();
};

export const deleteFile = async ({ bucketName, key }) => {
  return await s3
    .deleteObject({
      Bucket: bucketName,
      Key: key,
    })
    .promise();
};
