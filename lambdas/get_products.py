import json

def lambda_handler(event, context):
    products = [
        {
            "name": "Wireless Mouse",
            "description": "A sleek wireless mouse with ergonomic design."
        },
        {
            "name": "Mechanical Keyboard",
            "description": "A durable keyboard with customizable RGB lighting."
        }
    ]
    
    return {
        'statusCode': 200,
        'body': json.dumps(products)
    }
