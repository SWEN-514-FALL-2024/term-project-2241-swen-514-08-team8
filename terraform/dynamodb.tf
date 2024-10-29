#Creates a DynamoDB tables
resource "aws_dynamodb_table" "user_table" {
    name = "User"
    billing_mode = "PROVISIONED" #Should be free-tier
    read_capacity = 5 
    write_capacity = 5
    hash_key = "UserId"
    attribute {
        name = "UserId"
        type = "N"
    }
}

resource "aws_dynamodb_table" "cart_table" {
    name = "Cart"
    billing_mode = "PROVISIONED" #Should be free-tier
    read_capacity = 10
    write_capacity = 10
    hash_key = "CartId"
    attribute {
        name = "CartId"
        type = "N"
    }
}

resource "aws_dynamodb_table" "product_table" {
    name = "Product"
    billing_mode = "PROVISIONED" #Should be free-tier
    read_capacity = 10 
    write_capacity = 10
    hash_key = "ProductId"
    attribute {
        name = "ProductId"
        type = "N"
    }
}