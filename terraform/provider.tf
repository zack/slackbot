terraform {
  required_version = ">= 1.3"
  backend "s3" {
    bucket         = "slackbot-tfstate"
    encrypt        = true
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "slackbot-dynamo-lock"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.51.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.4.3"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  default_tags {
    tags = {
      Environment = var.environment
      Application = var.application
      Owner       = var.owner
    }
  }
}
