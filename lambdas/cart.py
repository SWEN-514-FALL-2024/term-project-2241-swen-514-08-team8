import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Cart')

def add_to_cart(event, context):

    #Get authenticated user identifier from cognito
    user_id = event['requestContext']['authorizer']['claims']['sub']
    
    body = json.loads(event['body'])
    product_id = body.get('id')
    quantity = 1
    
    if not product_id or not quantity:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Product ID and quantity are required'})
        }
    
    try:
        response = table.update_item(
            Key={
                'userId': user_id,        #Partition key for the user
                'productId': product_id   #Sort key for the specific product
            },
            UpdateExpression="SET quantity = :quantity",
            ExpressionAttributeValues={
                ':quantity': quantity
            },
            ReturnValues="UPDATED_NEW"
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Product added to cart successfully', 'data': response['Attributes']})
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