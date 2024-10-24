resource "aws_s3_bucket" "ecombucket" {
  bucket = "ecommerce-bucket-${random_integer.random_suffix.result}"
  tags = {
    Name = "ecommerce-bucket"
  }
}

resource "aws_s3_object" "index" {
  bucket = aws_s3_bucket.ecombucket.bucket
  key = "index.html"
  source = "index.html"
  content_type = "text/html"  # Ensure correct MIME type
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