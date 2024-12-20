resource "aws_cognito_user_pool" "my_user_pool" {
  name = "my_user_pool"
  deletion_protection = "INACTIVE"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }
  schema {
    name                = "admin"
    attribute_data_type = "Boolean"
    mutable             = true
    required            = false
  }
}


resource "aws_cognito_user_pool_client" "app_client" {
  name         = "app_client"
  user_pool_id = aws_cognito_user_pool.my_user_pool.id

  generate_secret              = false
  explicit_auth_flows          = ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"]
  supported_identity_providers = ["COGNITO"]
}


resource "aws_cognito_user" "test_user" {
  user_pool_id = aws_cognito_user_pool.my_user_pool.id
  username     = "test@gmail.com"
  password     = "Password1$"
  attributes = {
    email          = "test@gmail.com"
    email_verified = true
  }
  depends_on = [aws_cognito_user_pool.my_user_pool]

}

resource "aws_cognito_user" "admin_user" {
  user_pool_id = aws_cognito_user_pool.my_user_pool.id
  username     = "admin@gmail.com"
  password     = "Password1$"
  attributes = {
    email          = "admin@gmail.com"
    email_verified = true
    admin          = true
  }
  depends_on = [aws_cognito_user_pool.my_user_pool]

}


# resource "aws_cognito_user_group" "admin_group" {
#   name         = "Admins"
#   user_pool_id = aws_cognito_user_pool.my_user_pool.id
#   precedence   = 1

#   role_arn = aws_iam_role.admin_role.arn
# }

# resource "aws_iam_role" "admin_role" {
#   name = "Cognito_Admin_Role"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = "sts:AssumeRole"
#         Effect = "Allow"
#         Principal = {
#           Federated = "cognito-identity.amazonaws.com"
#         }
#       },
#     ]
#   })
# } 