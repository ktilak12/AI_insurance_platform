# Amazon RDS / Aurora PostgreSQL 16 with pgvector extension enabled

resource "aws_db_subnet_group" "db_subnet" {
  name        = "policylens-${var.environment}-db-subnet-group"
  description = "Subnet group for PolicyLens PostgreSQL DB"
  subnet_ids  = aws_subnet.private_db[*].id

  tags = {
    Name = "policylens-${var.environment}-db-subnet-group"
  }
}

resource "aws_security_group" "rds" {
  name        = "policylens-${var.environment}-rds-sg"
  description = "Controls access to PostgreSQL database from ECS application cluster"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from ECS App Tasks"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "policylens-${var.environment}-rds-sg"
  }
}

resource "aws_db_parameter_group" "pg16_vector" {
  name        = "policylens-${var.environment}-pg16-vector-params"
  family      = "postgres16"
  description = "PostgreSQL 16 parameter group with pgvector and memory optimization"

  # Performance Tuning for IVFFlat / HNSW Vector Indexing
  parameter {
    name  = "shared_preload_libraries"
    value = "vector"
  }

  parameter {
    name  = "work_mem"
    value = "65536" # 64MB for fast vector indexing
  }

  parameter {
    name  = "maintenance_work_mem"
    value = "524288" # 512MB for index creation
  }

  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }
}

resource "aws_db_instance" "postgres" {
  identifier             = "policylens-${var.environment}-postgres"
  engine                 = "postgres"
  engine_version         = "16.2"
  instance_class         = var.db_instance_class
  allocated_storage      = 50
  max_allocated_storage  = 500
  storage_type           = "gp3"
  storage_encrypted      = true
  kms_key_id             = aws_kms_key.secrets.arn
  
  db_name                = "insurance_db"
  username               = "policylens_admin"
  password               = random_password.db_password.result
  
  db_subnet_group_name   = aws_db_subnet_group.db_subnet.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.pg16_vector.name
  
  multi_az               = var.environment == "production" ? true : false
  publicly_accessible    = false
  skip_final_snapshot    = var.environment != "production"
  final_snapshot_identifier = "policylens-${var.environment}-final-snap"
  deletion_protection    = var.environment == "production" ? true : false

  backup_retention_period = 30
  backup_window           = "03:00-04:00"
  maintenance_window      = "Sun:04:30-Sun:05:30"

  tags = {
    Name = "policylens-${var.environment}-postgres"
  }
}

resource "random_password" "db_password" {
  length  = 32
  special = false
}
