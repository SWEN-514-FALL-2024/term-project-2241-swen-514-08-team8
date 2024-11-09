resource "aws_api_gateway_rest_api" "ecommerce-api" {
  body = jsonencode({
    openapi = "3.0.1"
    info = {
      title   = "ecommerce"
      version = "1.0"
    }

    paths = {
      "/cart" = {
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
          security = [
            {
              CognitoAuthorizer = []
            }
          ]
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
        components = {
          securitySchemes = {
            CognitoAuthorizer = {
              type = "apiKey"
              name = "Authorization"
              in   = "header"
              x-amazon-apigateway-authtype = "cognito_user_pools"
            }
        }
    }
      }
      "/products" = {
        # options = {
        #   x-amazon-apigateway-integration = {
        #     type                 = "MOCK"
        #     requestTemplates     = { "application/json" = "{\"statusCode\": 200}" }
        #     passthroughBehavior  = "WHEN_NO_MATCH"
        #   }
        #   responses = {
        #     "200" = {
        #       description = "Default response for CORS preflight requests."
        #       headers = {
        #         "Access-Control-Allow-Origin" = { schema = { type = "string" } }
        #         "Access-Control-Allow-Methods" = { schema = { type = "string" } }
        #         "Access-Control-Allow-Headers" = { schema = { type = "string" } }
        #       }
        #       content = {
        #         "application/json" = { schema = { type = "object" } }
        #       }
        #     }
        #   }
        # }
        get = {
          x-amazon-apigateway-integration = {
            type                 = "AWS_PROXY"
            httpMethod           = "POST"
            uri                  = "${aws_lambda_function.get-products.invoke_arn}"
            payloadFormatVersion = "2.0"
          }
          # responses = {
          #   "200" = {
          #     headers = {
          #       "Access-Control-Allow-Origin" = { schema = { type = "string" } }
          #       "Access-Control-Allow-Methods" = { schema = { type = "string" } }
          #     }
          #   }
          # }
          # parameters = [
          #   {
          #     name     = "limit"
          #     in       = "query"
          #     required = false
          #     schema = {
          #       type = "integer"
          #     }
          #   },
          #   {
          #     name     = "sort"
          #     in       = "query"
          #     required = false
          #     schema = {
          #       type = "string"
          #       enum = ["asc", "desc"]
          #     }
          #   }
          # ]
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
            httpMethod           = "GET"
            payloadFormatVersion = "1.0"
            type                 = "HTTP_PROXY"
            uri                  = "https://fakestoreapi.com/products/{id}"
            requestParameters = {
              "integration.request.path.id" = "method.request.path.id"
            }
            passthroughBehavior = "WHEN_NO_MATCH"
            connectionType      = "INTERNET"
            contentHandling     = "CONVERT_TO_TEXT"
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

resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name          = "CognitoAuthorizer"
  rest_api_id   = aws_api_gateway_rest_api.ecommerce-api.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = [aws_cognito_user_pool.my_user_pool.arn]
}

resource "aws_api_gateway_deployment" "ecommerce-api" {
  rest_api_id = aws_api_gateway_rest_api.ecommerce-api.id

  triggers = {
    redeployment = jsonencode(aws_api_gateway_rest_api.ecommerce-api.body)
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "ecommerce-api-stage" {
  deployment_id = aws_api_gateway_deployment.ecommerce-api.id
  rest_api_id   = aws_api_gateway_rest_api.ecommerce-api.id
  
  stage_name    = "ecommerce-api-stage"
}