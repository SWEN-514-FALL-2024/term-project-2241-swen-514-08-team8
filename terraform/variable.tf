variable "instance_type" {
 type        = string
 description = "Instance type for the EC2 instance"
 default     = "t2.micro"
}

resource "random_integer" "random_suffix" {
  min = 10000000
  max = 99999999
}