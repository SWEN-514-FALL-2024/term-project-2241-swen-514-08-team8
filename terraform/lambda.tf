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