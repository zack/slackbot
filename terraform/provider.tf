terraform {
  required_version = ">= 1.3"
  backend "s3" {
    bucket         = "zack-slackbot-tfstate"
    encrypt        = true
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "zack-slackbot-dynamo-lock"
    profile        = "LightSailUser-706974474835"
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
