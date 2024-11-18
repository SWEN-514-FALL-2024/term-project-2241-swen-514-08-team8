#Creates a DynamoDB tables
resource "aws_dynamodb_table" "user_table" {
    name = "User"
    billing_mode = "PAY_PER_REQUEST" #Should be free-tier
    hash_key = "UserId"

    attribute {
        name = "UserId"
        type = "N"
    }
}

resource "aws_dynamodb_table" "cart_table" {
    name = "Cart"
    billing_mode = "PAY_PER_REQUEST" #Should be free-tier
    hash_key = "UserId"
    range_key = "itemId"
    
    #Stores carts per user identifier
    attribute {
        name = "UserId"
        type = "S"
    }


    attribute {
        name = "itemId"
        type = "S"
    }

    attribute {
    name = "ProductId"
    type = "N" 
  }

    # Define the Global Secondary Index (GSI)
    global_secondary_index {
        name               = "UserId-ProductId-index" 
        hash_key           = "UserId"                   # Partition key for the GSI
        range_key          = "ProductId"                # Sort key for the GSI
        projection_type    = "ALL"    
    }
}

resource "aws_dynamodb_table" "product_table" {
    name = "Product"
    billing_mode = "PAY_PER_REQUEST" #Should be free-tier
    hash_key = "ProductId"

    attribute {
        name = "ProductId"
        type = "N"
    }
}