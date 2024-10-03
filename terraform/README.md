# Team8-TerraformHW

## Instructions:
1. Launch EC2 Instance using AMI
    - create an EC2 instance 
    - Go to AMI and find Team8-TerraformHW
    - Choose instance type as t2.micro, add the keypair that created
    - Launch the instance
2. Pre Installed with all required scripts
    - terraform_install.sh will have terraform installed
    - configure the aws cli
    - clone the repo from github
    - create keypair call "My-AWS-KEY"
3. Run the program
    - ssh to your instance
    - navigate to your terraform repo
    - terraform init, terraform plan, terraform apply
    - after test it, terraform destory
