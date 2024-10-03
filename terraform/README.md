# Team8-TerraformHW

## Instructions:
1. Launch EC2 Instance using AMI
    - Create an EC2 instance.
    - Go to AMI and find Team8-TerraformHW.
    - Choose instance type as t2.micro, add the keypair that created.
    - Launch the instance.
2. Pre Installed with all required scripts
    - terraform_install.sh will have terraform installed.
    - Configure the AWS CLI by typing `aws configure` and providing the information you're prompted for.
    - Clone the repo from GitHub.
    - Create a keypair called "My-AWS-KEY".
3. Run the program
    - ssh to your instance.
    - Navigate to your terraform repo.
    - Type and enter `terraform init`, `terraform plan`, and `terraform apply`.
    - After testing it, type and enter `terraform destory`.
