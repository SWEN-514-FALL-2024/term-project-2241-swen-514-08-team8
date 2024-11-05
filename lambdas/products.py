import json
import boto3
import boto3.dynamodb;
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
client = boto3.client('dynamodb')

def convert_decimals(obj):
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj) if obj % 1 > 0 else int(obj)
    else:
        return obj

def get_products(event, context):
    table = dynamodb.Table('Product')

    try:
        # Scan to get all products
        response = table.scan()
        products = convert_decimals(response.get('Items', []))

        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*",  
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            'body': json.dumps(products)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


def create_product(event, context):
    table = dynamodb.Table('Product')

    # Get data.
    product_id = event['id']
    product_name = event['name']
    price = event['price']
    in_stock = event['in_stock']
    
    nextOrderId = response['Attributes']['count']

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