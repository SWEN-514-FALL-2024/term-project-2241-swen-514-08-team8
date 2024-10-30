import json
import boto3
import urllib3
from decimal import Decimal

def populate_products(event, context):
    table_name = event["table"]

    http = urllib3.PoolManager()
    response = http.request("GET", "https://fakestoreapi.com/products")
    products = json.loads(response.data.decode('utf-8'), parse_float=Decimal)

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    with table.batch_writer() as batch:
        for product in products:
            batch.put_item(Item={
                'ProductId': product['id'],            
                'title': product['title'],
                'price': str(product['price']),
                'description': product['description'],
                'category': product['category'],
                'image': product['image'],
                'rating_rate': product['rating']['rate'],
                'rating_count': product['rating']['count'], 
            })
    
    return {
        'statusCode': 200,
        'body': json.dumps(f'Successfully populated {table_name} with product data.')
    }
