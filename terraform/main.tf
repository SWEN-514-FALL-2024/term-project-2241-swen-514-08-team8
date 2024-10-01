variable "region" {
  default = "us-east-1"
}

variable "domain_name" {
  default = "   .me"
}

provider "aws" {
  region = "${var.region}"
}
