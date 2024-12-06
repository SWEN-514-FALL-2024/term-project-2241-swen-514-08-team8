resource "aws_api_gateway_rest_api" "ecommerce-api" {
  body = jsonencode({
    openapi = "3.0.1"
    info = {
      title   = "ecommerce"
      version = "1.0"
    }

    paths = {
      /*"/cart" = {
        options = {
          summary     = "CORS support"
          description = "Enable CORS by returning the correct headers"
          responses = {
            "200" = {
              description = "Default response for CORS method"
              headers = {
                "Access-Control-Allow-Origin" = {
                  schema = {
                    type = "string"
                  }
                }
                "Access-Control-Allow-Methods" = {
                  schema = {
                    type = "string"
                  }
                }
                "Access-Control-Allow-Headers" = {
                  schema = {
                    type = "string"
                  }
                }
              }
              content = {
                "application/json" = {
                  schema = {
                    type = "object"
                  }
                }
              }
            }
          }
          x-amazon-apigateway-integration = {
            type = "mock"
            requestTemplates = {
              "application/json" = "{\"statusCode\": 200}"
            }
            responses = {
              "default" = {
                statusCode = "200"
                responseParameters = {
                  "method.response.header.Access-Control-Allow-Origin"  = "'*'"
                  "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
                  "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
                }
                responseTemplates = {
                  "application/json" = ""
                }
              }
            }
          }
        }
        get = {
          x-amazon-apigateway-integration = {
            type                 = "AWS_PROXY"
            httpMethod           = "POST"
            uri                  = "${aws_lambda_function.get_cart_lambda.invoke_arn}"
            payloadFormatVersion = "2.0"
          }
        }
        post = {
          x-amazon-apigateway-integration = {
            type                 = "AWS_PROXY"
            httpMethod           = "POST"
            uri                  = "${aws_lambda_function.add_to_cart_lambda.invoke_arn}"
            payloadFormatVersion = "2.0"
          }
          responses = {
            "200" = {
              content = {
                "application/json" = {
                  schema = {
                    type = "object"
                  }
                }
              }
              headers = {
                "Access-Control-Allow-Origin" = {
                  schema = {
                    type = "string"
                  }
                }
              }
            }
          }
        }
      }*/
      "/products" = {
        options = {
          x-amazon-apigateway-integration = {
            type = "MOCK"
            requestTemplates = {
              "application/json" = "{\"statusCode\": 200}"
            }
            responses = {
              "default" = {
                statusCode = "200"
                responseParameters = {
                  "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
                  "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
                  "method.response.header.Access-Control-Allow-Origin"  = "'*'"
                }
                responseTemplates = {
                  "application/json" = ""
                }
              }
            }
          }
          responses = {
            "200" = {
              headers = {
                "Access-Control-Allow-Headers" = {
                  schema = {
                    type = "string"
                  }
                }
                "Access-Control-Allow-Methods" = {
                  schema = {
                    type = "string"
                  }
                }
                "Access-Control-Allow-Origin" = {
                  schema = {
                    type = "string"
                  }
                }
              }
            }
          }
        }
        get = {
          x-amazon-apigateway-integration = {
            type                 = "AWS_PROXY"
            httpMethod           = "POST"
            uri                  = "${aws_lambda_function.get-products.invoke_arn}"
            payloadFormatVersion = "2.0"
          }
          responses = {
            "200" = {
              headers = {
                "Access-Control-Allow-Origin" = { schema = { type = "string" } }
                "Access-Control-Allow-Methods" = { schema = { type = "string" } }
              }
            }
          }
        }
        post = {
          x-amazon-apigateway-integration = {
            type                 = "AWS_PROXY"
            httpMethod           = "POST"
            uri                  = "${aws_lambda_function.create-products.invoke_arn}"
            payloadFormatVersion = "2.0"
          }
          responses = {
            "200" = {
              content = {
                "application/json" = {
                  schema = {
                    type = "object"
                  }
                }
              }
              headers = {
                "Access-Control-Allow-Origin" = {
                  schema = {
                    type = "string"
                  }
                }
              }
            }
          }
        }
      }
      "/products/{id}" = {
        get = {
          x-amazon-apigateway-integration = {
            type                 = "AWS_PROXY"
            httpMethod           = "POST"
            uri                  = "${aws_lambda_function.get_product.invoke_arn}"
            payloadFormatVersion = "2.0"
          }
          responses = {
            "200" = {
              content = {
                "application/json" = {
                  schema = {
                    type = "object"
                  }
                }
              }
              headers = {
                "Access-Control-Allow-Origin" = {
                  schema = {
                    type = "string"
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  name = "ECommerceAPI"
}

//*** Cart ***\\

resource "aws_api_gateway_resource" "cart" {
  path_part   = "cart"
  parent_id   = aws_api_gateway_rest_api.ecommerce-api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.ecommerce-api.id
}

resource "aws_api_gateway_method" "cart_options" {
  rest_api_id   = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id   = aws_api_gateway_resource.cart.id
  http_method   = "OPTIONS"
  authorization = "NONE"

  depends_on = [aws_api_gateway_resource.cart]
}

resource "aws_api_gateway_model" "cart_response_model" {
  rest_api_id  = aws_api_gateway_rest_api.ecommerce-api.id
  content_type = "application/json"
  name         = "CartResponseModel"

  schema = <<EOF
  {
    "type": "object",
    "properties": {
      "statusCode": { "type": "integer" }
    }
  }
  EOF
}

resource "aws_api_gateway_method_response" "cart_options_response" {
  rest_api_id = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id = aws_api_gateway_resource.cart.id
  http_method = aws_api_gateway_method.cart_options.http_method
  status_code = 200

  response_models = {
    "application/json" = aws_api_gateway_model.cart_response_model.name
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Credentials" = true,
    "method.response.header.Access-Control-Allow-Headers"     = true,
    "method.response.header.Access-Control-Allow-Methods"     = true,
    "method.response.header.Access-Control-Allow-Origin"      = true,
  }

  depends_on = [aws_api_gateway_method.cart_options, aws_api_gateway_model.cart_response_model]
}

resource "aws_api_gateway_integration" "cart_options_integration" {
  rest_api_id = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id = aws_api_gateway_resource.cart.id
  http_method = aws_api_gateway_method.cart_options.http_method

  type = "MOCK"

  request_templates = {
    "application/json" = "{ \"statusCode\": 200 }"
  }

  depends_on = [aws_api_gateway_method.cart_options]
}


resource "aws_api_gateway_integration_response" "cart_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id = aws_api_gateway_resource.cart.id
  http_method = aws_api_gateway_method.cart_options.http_method
  status_code = aws_api_gateway_method_response.cart_options_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Credentials" = "'true'",
    "method.response.header.Access-Control-Allow-Origin"      = "'*'",
    "method.response.header.Access-Control-Allow-Headers"     = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods"     = "'OPTIONS,GET,POST,PUT'",
  }

  depends_on = [aws_api_gateway_method_response.cart_options_response]
}

//*** Cart POST ***\\

resource "aws_api_gateway_method" "cart_post" {
  rest_api_id   = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id   = aws_api_gateway_resource.cart.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id

  depends_on = [aws_api_gateway_resource.cart]
}

resource "aws_api_gateway_method_response" "cart_post_method_response" {
  rest_api_id = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id = aws_api_gateway_resource.cart.id
  http_method = aws_api_gateway_method.cart_post.http_method
  status_code = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true,
  }

  depends_on = [aws_api_gateway_method.cart_post]
}

resource "aws_api_gateway_integration" "cart_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id             = aws_api_gateway_resource.cart.id
  http_method             = aws_api_gateway_method.cart_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.add_to_cart_lambda.invoke_arn

  depends_on = [aws_api_gateway_method.cart_post]
}

//*** Cart GET ***\\

resource "aws_api_gateway_method" "cart_get" {
  rest_api_id   = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id   = aws_api_gateway_resource.cart.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id

  depends_on = [aws_api_gateway_resource.cart]
}

resource "aws_api_gateway_method_response" "cart_get_method_response" {
  rest_api_id = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id = aws_api_gateway_resource.cart.id
  http_method = aws_api_gateway_method.cart_get.http_method
  status_code = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true,
  }

  depends_on = [aws_api_gateway_method.cart_get]
}

resource "aws_api_gateway_integration" "cart_get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id             = aws_api_gateway_resource.cart.id
  http_method             = aws_api_gateway_method.cart_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.get_cart_lambda.invoke_arn

  depends_on = [aws_api_gateway_method.cart_get]
}

//*** Cart PUT ***\\

resource "aws_api_gateway_method" "cart_put" {
  rest_api_id   = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id   = aws_api_gateway_resource.cart.id
  http_method   = "PUT"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id

  depends_on = [aws_api_gateway_resource.cart]
}

resource "aws_api_gateway_method_response" "cart_put_method_response" {
  rest_api_id = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id = aws_api_gateway_resource.cart.id
  http_method = aws_api_gateway_method.cart_put.http_method
  status_code = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true,
  }

  depends_on = [aws_api_gateway_method.cart_put]
}

resource "aws_api_gateway_integration" "cart_put_integration" {
  rest_api_id             = aws_api_gateway_rest_api.ecommerce-api.id
  resource_id             = aws_api_gateway_resource.cart.id
  http_method             = aws_api_gateway_method.cart_put.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.update_added_cart_lambda.invoke_arn

  depends_on = [aws_api_gateway_method.cart_put]
}

//*** Cognito and Final Setup ***\\

resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name          = "CognitoAuthorizer"
  rest_api_id   = aws_api_gateway_rest_api.ecommerce-api.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = ["${aws_cognito_user_pool.my_user_pool.arn}"]
}

resource "aws_api_gateway_deployment" "ecommerce-api" {
  rest_api_id = aws_api_gateway_rest_api.ecommerce-api.id

  triggers = {
    redeployment = jsonencode(aws_api_gateway_rest_api.ecommerce-api.body)
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [aws_api_gateway_integration_response.cart_options_integration_response, aws_api_gateway_integration.cart_post_integration, aws_api_gateway_integration.cart_get_integration, aws_api_gateway_integration.cart_put_integration]
}

resource "aws_api_gateway_stage" "ecommerce-api-stage" {
  deployment_id = aws_api_gateway_deployment.ecommerce-api.id
  rest_api_id   = aws_api_gateway_rest_api.ecommerce-api.id

  stage_name = "ecommerce-api-stage"
}