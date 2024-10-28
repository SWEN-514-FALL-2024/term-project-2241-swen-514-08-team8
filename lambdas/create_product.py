import json
import boto3
import boto3.dynamodb;
from mypy_boto3_dynamodb.type_defs import Table

client = boto3.client('dynamodb')

def lambda_handler(event, context):
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