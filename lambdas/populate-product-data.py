import json
import boto3
import urllib3

def lambda_handler(event, context):
    table_name = event['detail']['requestParameters']['tableName']

    http = urllib3.PoolManager()
    response = http.request("GET", "https://fakestoreapi.com/products")
    products = json.loads(response.data.decode('utf-8'))

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    with table.batch_writer() as batch:
        for product in products:
            batch.put_item(Item={
                'id': str(product['id']),            
                'title': product['title'],
                'price': product['price'],
                'description': product['description'],
                'category': product['category'],
                'image': product['image']
            })
    
    return {
        'statusCode': 200,
        'body': json.dumps(f'Successfully populated {table_name} with product data.')
    }
