output "s3_website_url" {
  value       = "http://${aws_s3_bucket_website_configuration.s3_website_config.website_endpoint}"
  description = "URL of ecommerce website"
}

output "api_gateway_url" {
  value       = aws_api_gateway_stage.ecommerce-api-stage.invoke_url
  description = "URL of ecommerce API"
}

output "client_id" {
  value = aws_cognito_user_pool_client.app_client.id
  description = "cognito user client id"
}

output "user_pool_id" {
  value = aws_cognito_user_pool.my_user_pool.id
  description = "cognito user pool id"
}