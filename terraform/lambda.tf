
# To upload lambda functions in terraform, we need to zip them first.
# It will be easier to upload all of our lambda functions 
# if we group similar lambda functions in the same python file
data "archive_file" "zips" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/products.py"
  output_path = "${path.module}/../lambdas/zips/products.zip"
}

# get-products
resource "aws_lambda_function" "get-products" {
  function_name = "ecommerce-get-products"
  role          = aws_iam_role.lambda_iam_role.arn
  handler       = "products.get_products"
  runtime       = "python3.12"
  filename      = "${path.module}/../lambdas/zips/products.zip"

  depends_on = [ aws_iam_role.lambda_iam_role ]
}

# create-product  
resource "aws_lambda_function" "create-products" {
  function_name = "ecommerce-create-products"
  role          = aws_iam_role.lambda_iam_role.arn
  handler       = "products.create_product"
  runtime       = "python3.12"
  filename      = "${path.module}/../lambdas/zips/products.zip"

  depends_on = [ aws_iam_role.lambda_iam_role ]
}

# Unfortunately we need to hard code these function names.
# There is an alternative, where we dynamically create all our lambdas in a single "aws_lambda_function" with a for-each loop.
# This should work for now with our limited number of lambdas.
variable "lambda_function_names" {
  default = [
    "ecommerce-get-products",
    "ecommerce-create-products",    
  ]
}

# Allows our APIGateway to use the defined lambdas.
resource "aws_lambda_permission" "allow_apigateway_all_functions" {
  for_each = toset(var.lambda_function_names)

  statement_id  = "AllowExecutionFromAPIGateway-${each.value}" 
  action        = "lambda:InvokeFunction"
  function_name = each.value 
  principal     = "apigateway.amazonaws.com"

  source_arn    = "${aws_api_gateway_rest_api.ecommerce-api.execution_arn}/*/*" 
}