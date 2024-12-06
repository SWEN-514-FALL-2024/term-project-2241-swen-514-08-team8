data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }

  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_full_access" {
  role       = aws_iam_role.lambda_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_iam_role" "lambda_iam_role" {
  name               = "ecom_lambda_iam_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}


// products bucket
resource "aws_iam_user" "s3_products_iam_user" {
  name = "ecom_s3_products_iam_user"
}

resource "aws_iam_access_key" "s3_upload_user_key" {
  user       = aws_iam_user.s3_products_iam_user.name
  depends_on = [aws_iam_user.s3_products_iam_user]
}
resource "aws_iam_role" "s3_products_iam_role" {
  name               = "ecom_s3_products_iam_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_s3_bucket_policy" "products_bucket_policy" {
  bucket = aws_s3_bucket.products_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "arn:aws:s3:::${aws_s3_bucket.products_bucket.bucket}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.products_bucket_public_access_block]
}

resource "aws_iam_policy" "s3_products_policy" {
  name        = "s3_products_policy"
  description = "Policy for S3 products bucket access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${aws_s3_bucket.products_bucket.bucket}",
          "arn:aws:s3:::${aws_s3_bucket.products_bucket.bucket}/*"
        ]
      }
    ]
  })
}
resource "aws_iam_user_policy_attachment" "s3_products_iam_user_policy_attachment" {
  user       = aws_iam_user.s3_products_iam_user.name
  policy_arn = aws_iam_policy.s3_products_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_s3_full_access" {
  role       = aws_iam_role.lambda_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}