#Testing data to seed the db
resource "aws_dynamodb_table_item" "item1" {
    depends_on = [
        aws_dynamodb_table.user_table
    ]
    table_name = aws_dynamodb_table.user_table.name
    hash_key = aws_dynamodb_table.user_table.hash_key

    item = jsonencode({
        "UserId": {"N": "1"},
        "UserName": {"S": "Fernando Smith"}
        })
}

resource "aws_dynamodb_table_item" "item2" {
    depends_on = [
        aws_dynamodb_table.user_table
    ]
    table_name = aws_dynamodb_table.user_table.name
    hash_key = aws_dynamodb_table.user_table.hash_key

    item = jsonencode({
        "UserId": {"N": "2"},
        "UserName": {"S": "John Commerce"}
        })
}

resource "aws_dynamodb_table_item" "item3" {
    depends_on = [
        aws_dynamodb_table.cart_table
    ]
    table_name = aws_dynamodb_table.cart_table.name
    hash_key = aws_dynamodb_table.cart_table.hash_key

    item = jsonencode({
        "CartId": {"N": "1"},
        "UserId": {"N": "1"},
        "ProductId": {"N":"1"}
        })
}

resource "aws_dynamodb_table_item" "item4" {
    depends_on = [
        aws_dynamodb_table.product_table
    ]
    table_name = aws_dynamodb_table.product_table.name
    hash_key = aws_dynamodb_table.product_table.hash_key

    item = jsonencode({
        "ProductId": {"N": "1"},
        "Title": {"S": "Drill"},
        "Price": {"N":"35"},
        "Description": {"S":"Regular Drill"},
        "Category": {"S":"Tools"},
        })
}