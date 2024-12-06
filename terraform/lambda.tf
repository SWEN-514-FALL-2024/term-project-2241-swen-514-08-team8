
# To upload lambda functions in terraform, we need to zip them first.
# It will be easier to upload all of our lambda functions 
# if we group similar lambda functions in the same python file
data "archive_file" "zips" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/products.py"
  output_path = "${path.module}/../lambdas/zips/products.zip"
}

data "archive_file" "zips1" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/populate-product-data.py"
  output_path = "${path.module}/../lambdas/zips/populate-product-data.py"
}

data "archive_file" "zips2" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/cart.py"
  output_path = "${path.module}/../lambdas/zips/cart.py"
}

# get-products
resource "aws_lambda_function" "get-products" {
  function_name = "ecommerce-get-products"
  role          = aws_iam_role.lambda_iam_role.arn
  handler       = "products.get_products"
  runtime       = "python3.12"
  filename      = "${path.module}/../lambdas/zips/products.zip"

  depends_on = [aws_iam_role.lambda_iam_role]
}

# create-product  
resource "aws_lambda_function" "create-products" {
  function_name = "ecommerce-create-products"
  role          = aws_iam_role.lambda_iam_role.arn
  handler       = "products.create_product"
  runtime       = "python3.12"
  filename      = "${path.module}/../lambdas/zips/products.zip"

  depends_on = [aws_iam_role.lambda_iam_role]
}

# populate products
resource "aws_lambda_function" "populate-products_lambda" {
  function_name = "ecommerce-populate-products"
  role          = aws_iam_role.lambda_iam_role.arn
  handler       = "populate-product-data.populate_products"
  runtime       = "python3.12"
  filename      = "${path.module}/../lambdas/zips/populate-product-data.py"
  timeout       = 10

  depends_on = [aws_iam_role.lambda_iam_role]
}

#add to cart
resource "aws_lambda_function" "add_to_cart_lambda" {
  function_name = "ecommerce-add-to-cart"
  role          = aws_iam_role.lambda_iam_role.arn
  handler       = "cart.add_to_cart"
  runtime       = "python3.12"
  filename      = "${path.module}/../lambdas/zips/cart.py"
  timeout       = 4

  depends_on = [aws_iam_role.lambda_iam_role]
}

resource "aws_lambda_function" "get_cart_lambda" {
  function_name = "ecommerce-get-cart"
  role          = aws_iam_role.lambda_iam_role.arn
  handler       = "cart.get_cart"
  runtime       = "python3.12"
  filename      = "${path.module}/../lambdas/zips/cart.py"
  timeout       = 4

  depends_on = [aws_iam_role.lambda_iam_role]
}

resource "aws_lambda_function" "update_added_cart_lambda" {
  function_name = "ecommerce-update_added_cart"
  role          = aws_iam_role.lambda_iam_role.arn
  handler       = "cart.update_added_cart"
  runtime       = "python3.12"
  filename      = "${path.module}/../lambdas/zips/cart.py"
  timeout       = 4

  depends_on = [aws_iam_role.lambda_iam_role]
}

resource "aws_lambda_function" "get_product" {
  function_name = "ecommerce-get-product"
  role          = aws_iam_role.lambda_iam_role.arn
  handler       = "products.get_product"
  runtime       = "python3.12"
  filename      = "${path.module}/../lambdas/zips/products.zip"

  depends_on = [aws_iam_role.lambda_iam_role]
}

# Unfortunately we need to hard code these function names.
# There is an alternative, where we dynamically create all our lambdas in a single "aws_lambda_function" with a for-each loop.
# This should work for now with our limited number of lambdas.
variable "lambda_function_names" {
  default = [
    "ecommerce-get-products",
    "ecommerce-get-product",
    "ecommerce-create-products",
    "ecommerce-populate-products",
    "ecommerce-add-to-cart",
    "ecommerce-get-cart",
    "ecommerce-update_added_cart"
  ]
}

# Allows our APIGateway to use the defined lambdas.
resource "aws_lambda_permission" "allow_apigateway_all_functions" {
  for_each = toset(var.lambda_function_names)

  statement_id  = "AllowExecutionFromAPIGateway-${each.value}"
  action        = "lambda:InvokeFunction"
  function_name = each.value
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.ecommerce-api.execution_arn}/*/*"
}