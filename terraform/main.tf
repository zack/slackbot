resource "aws_lightsail_container_service" "my_container_service" {
  name        = "${var.environment}-${var.application}-cs"
  power       = var.power
  scale       = var.scale
  is_disabled = var.container_service_is_disabled
}

resource "random_password" "db_username" {
  length           = 16
  special          = false
  numeric          = false
}

resource "random_password" "db_password" {
  length           = 28
  special          = false
}

resource "aws_lightsail_database" "app_db" {
  relational_database_name = "${var.environment}-${var.application}-db"
  availability_zone        = local.aws_lightsail_region
  master_database_name     = local.database_app_name
  master_password          = random_password.db_password.result
  master_username          = random_password.db_username.result
  blueprint_id             = var.db_blueprint_id
  bundle_id                = var.db_bundle_id
  apply_immediately        = var.apply_immediately
  publicly_accessible      = false
}
