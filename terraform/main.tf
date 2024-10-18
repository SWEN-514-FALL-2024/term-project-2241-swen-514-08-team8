provider "aws" {
  region = "us-east-1"
}

resource "aws_api_gateway_rest_api" "ecommerce-api" {
  body = jsonencode({
    openapi = "3.0.1"
    info = {
      title   = "ecommerce"
      version = "1.0"
    }

    paths = {
      "/products" = {
        get = {
          x-amazon-apigateway-integration = {
            httpMethod           = "GET"
            payloadFormatVersion = "1.0"
            type                 = "HTTP_PROXY"
            uri                  = "https://fakestoreapi.com/products"
          }
          parameters = [
            {
              name     = "limit"
              in       = "query"
              required = false
              schema = {
                type = "integer"
              }
            },
            {
              name     = "sort"
              in       = "query"
              required = false
              schema = {
                type = "string"
                enum = ["asc", "desc"]
              }
            }
          ]
        }
        # post = {
        #   x-amazon-apigateway-integration = {
        #     httpMethod           = "POST"
        #     payloadFormatVersion = "1.0"
        #     type                 = "HTTP_PROXY"
        #     uri                  = "https://fakestoreapi.com/products"
        #   }
        #   responses = {
        #     "200" = {
        #       content = {
        #         "application/json" = {
        #           schema = {
        #             type = "object"
        #           }
        #         }
        #       }
        #       headers = {
        #         "Access-Control-Allow-Origin" = {
        #           schema = {
        #             type = "string"
        #           }
        #         }
        #       }
        #     }
        #   }
        # }
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