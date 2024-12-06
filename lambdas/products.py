import json
import boto3
import boto3.dynamodb;
from decimal import Decimal
from random import randint

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

    # Parse the JSON body from the event
    body = json.loads(event['body'])

    # Insert into table using the parsed body
    try:
        table.put_item(
            Item={
                'ProductId': randint(25, 1000000),            
                'title': body['title'],
                'price': Decimal(body['price']),
                'description': body['description'],
                'category': body['category'],
                'image': body['image'],
                'rating_rate': Decimal(body['rating_rate']),
                'rating_count': body['rating_count'], 
            }
        )
    except KeyError as e:
        return {
            'statusCode': 200,
            'body': json.dumps({'error': str(e)})
        }

    return {
        'statusCode': 200,
        'body': json.dumps('Product created successfully')
    }

def get_product(event, context):
    print("event", event)
    print("context", context)

    product_id = -1
    try: 
        product_id = event['pathParameters']['id']
        print(product_id)
    except Exception:
        return {
            'status': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
        }
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Product')
    
    response = table.get_item(Key={'ProductId': int(product_id)})
    item = convert_decimals(response.get('Item', {}))
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(item)
    }