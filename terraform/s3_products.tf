resource "aws_s3_bucket" "products_bucket" {
  bucket = "ecommerce-products-bucket-${random_integer.random_suffix.result}"

  tags = {
    Name = "products-bucket"
  }

  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "products_bucket_public_access_block" {
  bucket = aws_s3_bucket.products_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_cors_configuration" "products_bucket_cors" {
  bucket = aws_s3_bucket.products_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
