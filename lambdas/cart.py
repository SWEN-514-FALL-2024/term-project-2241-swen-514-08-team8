import json
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
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

    item_id = body.get('id')
    product_id = body.get('productId')
    quantity = body.get('quantity')
    transactionId = body.get('transactionId')
    itemStatus = body.get('itemStatus')
    
    if not product_id or not quantity:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Product ID and quantity are required'})
        }
    
    try:
        response = table.query(
            IndexName="UserId-ProductId-index",
            KeyConditionExpression=Key('UserId').eq(user_id) & Key('ProductId').eq(product_id),
            FilterExpression='itemStatus = :itemStatus',
            ExpressionAttributeValues={
                ':itemStatus': "Added"
        })
        if (response['Count'] == 0):
            response = table.update_item(
                Key={
                    'UserId': user_id,        #Partition key for the user
                    'itemId': item_id   #Sort key for the specific product
                },
                UpdateExpression="""SET ProductId = :productId,
                        quantity = :quantity,
                        transactionId = :transactionId,
                        itemStatus = :itemStatus""",
                ExpressionAttributeValues={
                    ':productId': product_id,
                    ':quantity': quantity,
                    ':transactionId': transactionId,
                    ':itemStatus': itemStatus
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
    except ClientError as e:
            # Log detailed DynamoDB client error
            print("DynamoDB ClientError:", e.response['Error']['Message'])
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'DynamoDB Client Error', 'details': e.response['Error']['Message']})
            }
    except Exception as e:
        # Log generic exception details
        print("Exception occurred:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Could not update cart', 'details': str(e)})
        }
    
def get_cart(event, context):
    #Get authenticated user identifier from cognito
    user_id = event['requestContext']['authorizer']['claims']['sub']

    try:
        response = table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('UserId').eq(user_id)
        )
        
        items = convert_decimals(response.get('Items', []))
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'cartItems': items})
        }

    except Exception as e:
        print(f"Error retrieving cart items: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Could not retrieve cart items'})
        }

def update_added_cart(event, context):
    
    #Get authenticated user identifier from cognito
    user_id = event['requestContext']['authorizer']['claims']['sub']

    if isinstance(event['body'], str):
        body = json.loads(event['body'])
    else:
        body = event['body']

    item_id = body.get('itemId')
    product_id = body.get('ProductId')
    quantity = body.get('quantity')
    transactionId = body.get('transactionId')
    itemStatus = body.get('itemStatus')
    
    if not product_id :
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Product ID is required'})
        }
    
    try:
        response = table.update_item(
            Key={
                'UserId': user_id,       #Partition key for the user
                'itemId': item_id                   #Sort key for the specific product
            },
            UpdateExpression="""SET ProductId = :productId,
                    quantity = :quantity,
                    transactionId = :transactionId,
                    itemStatus = :itemStatus""",
            ConditionExpression='itemStatus = :currentStatus',
            ExpressionAttributeValues={
                ':productId': product_id,
                ':quantity': quantity,
                ':transactionId': transactionId,
                ':itemStatus': itemStatus,
                ':currentStatus': "Added"
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
    except ClientError as e:
        # Log detailed DynamoDB client error
        print("DynamoDB ClientError:", e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'DynamoDB Client Error', 'details': e.response['Error']['Message']})
        }
    except Exception as e:
        # Log generic exception details
        print("Exception occurred:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Could not update cart', 'details': str(e)})
        }