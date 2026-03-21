
import boto3
import uuid

AWS_ACCESS_KEY = "TON_ACCESS_KEY"
AWS_SECRET_KEY = "TON_SECRET_KEY"
AWS_BUCKET_NAME = "ton-bucket"
AWS_REGION = "us-east-1"

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

def upload_file_to_s3(file, project_id):
    # Générer un nom unique
    filename = f"{project_id}/{uuid.uuid4()}_{file.filename}"

    # Upload
    s3_client.upload_fileobj(
        file,
        AWS_BUCKET_NAME,
        filename,
        ExtraArgs={"ACL": "public-read"}
    )

    # Construire l'URL publique
    file_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
    return file_url