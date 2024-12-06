# resource "aws_iam_role" "api_gateway_cloudwatch_role" {
#   name = "APIGatewayCloudWatchLogsRole"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Effect = "Allow",
#         Principal = {
#           Service = "apigateway.amazonaws.com"
#         },
#         Action = "sts:AssumeRole"
#       }
#     ]
#   })
# }

# resource "aws_iam_role_policy" "api_gateway_cloudwatch_policy" {
#   role = aws_iam_role.api_gateway_cloudwatch_role.id

#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Effect = "Allow",
#         Action = [
#           "logs:CreateLogGroup",
#           "logs:CreateLogStream",
#           "logs:PutLogEvents",
#           "logs:DescribeLogGroups",
#           "logs:DescribeLogStreams"
#         ],
#         Resource = "*"
#       }
#     ]
#   })
# }

# resource "aws_api_gateway_account" "account" {
#   cloudwatch_role_arn = aws_iam_role.api_gateway_cloudwatch_role.arn
# }

# resource "aws_api_gateway_method_settings" "gateway_settings" {
#   rest_api_id = "${aws_api_gateway_rest_api.ecommerce-api.id}"
#   stage_name  = "${aws_api_gateway_stage.ecommerce-api-stage.stage_name}"
#   method_path = "*/*"
#   settings {
#     logging_level = "INFO"
#     data_trace_enabled = true
#     metrics_enabled = true
#   }
# }