data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

# Modify this variable to include additional lambda files.
variable "lambda_functions" {
  default = {
    "get_products"    = "get_products.lambda_handler"
    "create_product"    = "create_product.lambda_handler"
  }
}

data "archive_file" "zips" {
  for_each    = var.lambda_functions
  type        = "zip"
  source_content_filename = "${path.module}/../lambdas/${each.key}.py"
  output_path = "${path.module}/../lambdas/zips/${each.key}.zip"
}

# Create the lambda function.
resource "aws_lambda_function" "lambda" {
  for_each      = var.lambda_functions
  function_name = "ecom_lambda_${each.key}"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = each.value
  runtime       = "python3.12"
  filename      = data.archive_file.zips[each.key].output_path

  depends_on = [ aws_iam_role.iam_for_lambda ]
}