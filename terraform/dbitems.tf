#Testing data to seed the db
# resource "aws_dynamodb_table_item" "item1" {
#     depends_on = [
#         aws_dynamodb_table.user_table
#     ]
#     table_name = aws_dynamodb_table.user_table.name
#     hash_key = aws_dynamodb_table.user_table.hash_key

#     item = jsonencode({
#         "UserId": {"N": "1"},
#         "UserName": {"S": "Fernando Smith"}
#         })
# }

# resource "aws_dynamodb_table_item" "item2" {
#     depends_on = [
#         aws_dynamodb_table.user_table
#     ]
#     table_name = aws_dynamodb_table.user_table.name
#     hash_key = aws_dynamodb_table.user_table.hash_key

#     item = jsonencode({
#         "UserId": {"N": "2"},
#         "UserName": {"S": "John Commerce"}
#         })
# }

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


#resource "aws_dynamodb_table_item" "item4" {
    
    #table_name = aws_dynamodb_table.product_table.name
    #hash_key = aws_dynamodb_table.product_table.hash_key

    #item = jsonencode({
        #"ProductId": {"N": "1"},
        #"Title": {"S": "Drill"},
        #"Price": {"N":"35"},
        #"Description": {"S":"Regular Drill"},
        #"Category": {"S":"Tools"},
        #})
#}