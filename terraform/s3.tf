resource "aws_s3_bucket" "ecombucket" {
  bucket = "ecommerce-bucket-012910291021"
  tags = {
    Name = "ecommerce-bucket"
  }
}
