import os
import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("ai-service.secrets")

class SecretsManager:
    """
    Python AWS Secrets Manager & Vault Integration.
    In production: fetches and decrypts secrets from AWS Secrets Manager CMK.
    In development/testing: falls back to local environment variables with zero downtime.
    """
    _cached_secrets: Optional[Dict[str, Any]] = None

    @classmethod
    def get_secrets(cls) -> Dict[str, Any]:
        if cls._cached_secrets is not None:
            return cls._cached_secrets

        vault_name = os.getenv("AWS_SECRETS_VAULT_NAME")
        env_mode = os.getenv("ENVIRONMENT", os.getenv("NODE_ENV", "development"))

        if vault_name and env_mode == "production":
            try:
                import boto3
                from botocore.exceptions import ClientError

                region = os.getenv("AWS_REGION", "ap-south-1")
                client = boto3.client("secretsmanager", region_name=region)
                response = client.get_secret_value(SecretId=vault_name)

                if "SecretString" in response:
                    secrets_dict = json.loads(response["SecretString"])
                    cls._cached_secrets = secrets_dict
                    logger.info(f"Loaded credentials from AWS Secrets Manager vault: {vault_name}")
                    return cls._cached_secrets
            except Exception as e:
                logger.warning(f"Failed to fetch secrets from AWS Secrets Manager: {e}. Using local environment fallback.")

        # Local environment variables fallback
        cls._cached_secrets = {
            "DATABASE_URL": os.getenv("DATABASE_URL", "postgresql://postgres:postgrespassword@localhost:5432/insurance_db"),
            "INTERNAL_API_SECRET": os.getenv("INTERNAL_API_SECRET", "dev_internal_api_secret_64_characters_long_key_change_in_prod"),
            "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY", ""),
            "EMBEDDING_MODEL": os.getenv("EMBEDDING_MODEL", "text-embedding-004"),
            "EXTRACTION_MODEL": os.getenv("EXTRACTION_MODEL", "gemini-1.5-pro")
        }
        return cls._cached_secrets

    @classmethod
    def get(cls, key: str, default: Optional[str] = None) -> Optional[str]:
        secrets = cls.get_secrets()
        return secrets.get(key, os.getenv(key, default))
