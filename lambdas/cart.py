import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Cart')

def convert_decimals(obj):
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj) if obj % 1 > 0 else int(obj)
    else:
        return obj

def add_to_cart(event, context):

    #Get authenticated user identifier from cognito
    user_id = event['requestContext']['authorizer']['claims']['sub']
    
    if isinstance(event['body'], str):
        body = json.loads(event['body'])
    else:
        body = event['body']

    product_id = body.get('id')
    quantity = body.get('quantity')
    
    if not product_id or not quantity:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Product ID and quantity are required'})
        }
    
    try:
        response = table.update_item(
            Key={
                'UserId': user_id,        #Partition key for the user
                'ProductId': product_id   #Sort key for the specific product
            },
            UpdateExpression="SET quantity = :quantity",
            ExpressionAttributeValues={
                ':quantity': quantity
            },
            ReturnValues="UPDATED_NEW"
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': 'Product added to cart successfully', 'data': convert_decimals(response)})
        }
    
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Could not update cart'})
        }
    
def get_cart(event, context):
    #Get authenticated user identifier from cognito
    user_id = event['requestContext']['authorizer']['claims']['sub']

    try:
        response = table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('userId').eq(user_id)
        )
        
        items = response.get('Items', [])
        
        return {
            'statusCode': 200,
            'body': json.dumps({'cartItems': items})
        }

    except Exception as e:
        print(f"Error retrieving cart items: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Could not retrieve cart items'})
        }