resource "aws_s3_bucket" "ecombucket" {
  bucket = "ecommerce-bucket-${random_integer.random_suffix.result}"
  tags = {
    Name = "ecommerce-bucket"
  }
  force_destroy = true
}

resource "local_sensitive_file" "production_env" {
  content = <<EOF
VITE_COGNITO_USER_POOL_ID=${aws_cognito_user_pool.my_user_pool.id}
VITE_COGNITO_CLIENT_ID=${aws_cognito_user_pool_client.app_client.id}
VITE_SERVER_URL=${aws_api_gateway_stage.ecommerce-api-stage.invoke_url}
EOF
  filename = "${path.module}/../ecommerce/.env"
  depends_on = [ aws_cognito_user_pool.my_user_pool, aws_cognito_user_pool_client.app_client, aws_api_gateway_stage.ecommerce-api-stage ]
}

# Null resource to execute AWS CLI sync after bucket creation, uploading all our frontend files.
resource "null_resource" "deploy_react_app" {
  provisioner "local-exec" {
    command = "cd ../ecommerce && npm install && npm run build && aws s3 sync ./dist s3://${aws_s3_bucket.ecombucket.bucket} --delete"
  }

  depends_on = [aws_s3_bucket.ecombucket, local_sensitive_file.production_env] # Needs to run after ecombucket creation.
}

resource "aws_s3_bucket_public_access_block" "ecombucket_public_access_block" {
  bucket = aws_s3_bucket.ecombucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "ecombucket_policy" {
  bucket = aws_s3_bucket.ecombucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.ecombucket.arn}/*"
      }
    ]
  })

  depends_on = [ aws_s3_bucket_public_access_block.ecombucket_public_access_block ]
}


resource "aws_s3_bucket_website_configuration" "s3_website_config" {
  bucket = aws_s3_bucket.ecombucket.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }

  depends_on = [ aws_s3_bucket_public_access_block.ecombucket_public_access_block ]
}
