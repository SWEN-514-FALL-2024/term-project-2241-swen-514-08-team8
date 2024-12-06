resource "aws_lambda_invocation" "populate_products_invocation" {
  depends_on = [
    aws_dynamodb_table.product_table
  ]

  function_name = aws_lambda_function.populate-products_lambda.function_name

  input = jsonencode({
    table = "Product"
  })
}

output "result_entry" {
  value = jsondecode(aws_lambda_invocation.populate_products_invocation.result)
}