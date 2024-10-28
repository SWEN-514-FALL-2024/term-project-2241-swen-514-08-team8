import json
import boto3
import boto3.dynamodb;

client = boto3.client('dynamodb')

def get_products(event, context):
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


def create_product(event, context):
    # Get data.
    product_id = event['id']
    product_name = event['name']
    price = event['price']
    in_stock = event['in_stock']

    # insert into table
    response = client.put_item(
        TableName='ProductCatalog',
        Item={
            'Id': {'N': product_id},
            'Title': {'S': product_name},
            'Price': {'N': price},
            'InStock': {'N': in_stock}
        }
    )

    return response