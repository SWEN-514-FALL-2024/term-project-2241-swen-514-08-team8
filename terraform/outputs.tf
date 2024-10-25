output "s3_website_url" {
  value       = "http://${aws_s3_bucket_website_configuration.s3_website_config.website_endpoint}"
  description = "URL of ecommerce website"
}