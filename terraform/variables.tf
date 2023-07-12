// create a variable for the region
variable "aws_region" {
  description = "The AWS region to deploy to"
  default     = "us-east-1"
  type        = string
}

// create a variable for the application name
variable "application" {
  description = "The name of the application"
  default     = "slackbot"
  type        = string
}

// create a variable for the environment
variable "environment" {
  description = "The environment to deploy to"
  default     = "dev"
  type        = string
}

// create a variable for the owner
variable "owner" {
  description = "The owner of the application"
  default     = "devsecops"
  type        = string
}

// create a variable for the container service scale
variable "scale" {
  description = "The scale of the container service, How many host nodes to run."
  default     = 1
  type        = number
}

// create a variable for container service power
variable "power" {
  description = "The power of the container service"
  default     = "nano"
  type        = string
  validation {
    condition     = contains(["nano", "micro", "small", "medium", "large", "xlarge"], var.power)
    error_message = "The power must be one of nano, micro, small, medium, large, and xlarge."
  }
}

// create a variable for container service is disabled
variable "container_service_is_disabled" {
  description = "Whether the container service is disabled"
  default     = false
  type        = bool
}

// create a variable for the database blueprint id
variable "db_blueprint_id" {
  description = "The database blueprint id"
  default     = "mysql_8_0"
  type        = string
  validation {
    condition     = contains(["mysql_8_0", "postgres_12"], var.db_blueprint_id)
    error_message = "The database blueprint id must be one of mysql_8_0 and postgres_12."
  }
}

// create a variable for the database bundle id
variable "db_bundle_id" {
  description = "The database bundle id"
  default     = "micro_2_0"
  type        = string
  validation {
    condition     = contains(["micro_2_0", "micro_ha_2_0", "small_2_0", "small_ha_2_0", "medium_2_0", "medium_ha_2_0", "large_2_0", "large_ha_2_0"], var.db_bundle_id)
    error_message = "The database bundle id must be one of micro_2_0, small_2_0, medium_2_0, and large_2_0. All can be infixed with ha_ for high availability. (Example: micro_ha_2_0)"
  }
}

// create a variable for apply immediately
variable "apply_immediately" {
  description = "Whether to apply database changes immediately or wait for the next maintenance window."
  default     = true
  type        = bool
}

locals {
  underscored_environment = replace(var.environment, "-", "_")
  underscored_application = replace(var.application, "-", "_")
  database_app_name = "${local.underscored_environment}_${local.underscored_application}"

  aws_lightsail_region = "${var.aws_region}a"
}
