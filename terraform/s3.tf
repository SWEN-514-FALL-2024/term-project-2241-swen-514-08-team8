resource "aws_s3_bucket" "ecombucket" {
  bucket = "ecommerce-bucket-${random_integer.random_suffix.result}"
  tags = {
    Name = "ecommerce-bucket"
  }
}

# Old upload version
# resource "aws_s3_object" "index" {
#   bucket = aws_s3_bucket.ecombucket.bucket
#   key = "index.html"
#   source = "index.html"
#   content_type = "text/html"  # Ensure correct MIME type
# }

# Null resource to trigger AWS CLI sync, uploading all our frontend files.
resource "null_resource" "deploy_react_app" {
  provisioner "local-exec" {
    command = <<EOT
      cd ../app/frontend && npm install && npm run build && aws s3 sync ./dist s3://${aws_s3_bucket.ecombucket.bucket} --delete
    EOT
  }

  depends_on = [aws_s3_bucket.ecombucket] # Needs to run after ecombucket creation.
}

# Deletes the contents of the s3 bucket so we can delete it.
resource "null_resource" "empty_bucket" {
  provisioner "local-exec" {
    command = <<EOT
      aws s3 rm s3://${aws_s3_bucket.ecombucket.bucket} --recursive
    EOT
  }

  # Ensure this runs before the bucket is deleted
  triggers = {
    bucket_name = aws_s3_bucket.ecombucket.bucket
  }

  depends_on = [aws_s3_bucket.ecombucket]
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
}


resource "aws_s3_bucket_website_configuration" "s3_website_config" {
  bucket = aws_s3_bucket.ecombucket.bucket

  index_document {
    suffix = "index.html"
  }

  depends_on = [ aws_s3_bucket_public_access_block.ecombucket_public_access_block ]
}