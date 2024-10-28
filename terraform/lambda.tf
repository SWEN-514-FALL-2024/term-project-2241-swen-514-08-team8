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

data "archive_file" "zip_the_python_code" {
  type        = "zip"
  source_dir  = "${path.module}/python/"
  output_path = "${path.module}/python/hello-python.zip"
}

resource "aws_lambda_function" "test_lambda" {
  function_name = "get_product_function"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "get_products.lambda_handler"
  runtime       = "python3.12"
  filename = "${path.module}/../lambdas/get_products.zip"
  
  depends_on = [ data.archive_file.zip_the_python_code ]
}
