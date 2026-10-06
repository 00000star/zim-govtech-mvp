"""
Zimbabwe GovTech MVP - Crypto Vault
Compliant with Cyber and Data Protection Act [Ch 12:07] & S.I. 155/2024.
Features:
- AES-256-GCM field-level encryption for PII (National ID, Passport, Address)
- HMAC-SHA256 Blind Indexing with canonical normalization for fast lookups
- SQLite citizens_vault repository
"""

import os
import hmac
import hashlib
import sqlite3
import base64
from typing import Optional, Dict, Any
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# Default keys for MVP demonstration (in production, loaded from HSM/KMS)
# 256-bit AES key
DEFAULT_AES_KEY = os.environ.get(
    "VAULT_AES_KEY",
    "e9c402b8d0e51381bf49dafa068e8e7a634125b297b47b4cb7df51759600e12d"
)
# 256-bit Blind Index HMAC key
DEFAULT_HMAC_KEY = os.environ.get(
    "VAULT_HMAC_KEY",
    "4d5a89f36b284e93bb8d29c4501a34e062c3b2817e94cb025531d09ae21b1842"
)

DB_PATH = os.environ.get(
    "VAULT_DB_PATH",
    "/sdcard/Antigravity_Projects/zim-govtech-mvp/citizens_vault.db"
)


def canonicalize_identifier(value: str) -> str:
    """Strip whitespace, hyphens, and convert to uppercase."""
    if not value:
        return ""
    return value.replace(" ", "").replace("-", "").strip().upper()


def compute_blind_index(raw_value: str, hmac_key_hex: str = DEFAULT_HMAC_KEY) -> str:
    """Compute deterministic HMAC-SHA256 blind index from canonical string."""
    canonical = canonicalize_identifier(raw_value)
    key_bytes = bytes.fromhex(hmac_key_hex)
    mac = hmac.new(key_bytes, canonical.encode("utf-8"), hashlib.sha256)
    return mac.hexdigest()


class CryptoVault:
    def __init__(
        self,
        db_path: str = DB_PATH,
        aes_key_hex: str = DEFAULT_AES_KEY,
        hmac_key_hex: str = DEFAULT_HMAC_KEY
    ):
        self.db_path = db_path
        self.aes_key = bytes.fromhex(aes_key_hex)
        self.hmac_key_hex = hmac_key_hex
        self.aesgcm = AESGCM(self.aes_key)
        self.init_schema()

    def init_schema(self) -> None:
        """Initialize SQLite schema for encrypted citizen records."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS citizens_vault (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    blind_index TEXT UNIQUE NOT NULL,
                    full_name TEXT NOT NULL,
                    encrypted_national_id TEXT NOT NULL,
                    encrypted_passport TEXT,
                    encrypted_address TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_blind_index 
                ON citizens_vault(blind_index);
            """)
            conn.commit()

    def encrypt_field(self, plaintext: Optional[str]) -> Optional[str]:
        """Encrypt plaintext string using AES-256-GCM. Returns base64 nonce+ciphertext."""
        if plaintext is None:
            return None
        nonce = os.urandom(12)  # Standard 96-bit nonce for AES-GCM
        data = plaintext.encode("utf-8")
        ciphertext = self.aesgcm.encrypt(nonce, data, None)
        # Combine nonce + ciphertext
        payload = nonce + ciphertext
        return base64.b64encode(payload).decode("ascii")

    def decrypt_field(self, encrypted_b64: Optional[str]) -> Optional[str]:
        """Decrypt base64-encoded nonce+ciphertext with AES-256-GCM."""
        if not encrypted_b64:
            return None
        payload = base64.b64decode(encrypted_b64.encode("ascii"))
        nonce = payload[:12]
        ciphertext = payload[12:]
        data = self.aesgcm.decrypt(nonce, ciphertext, None)
        return data.decode("utf-8")

    def store_citizen(
        self,
        full_name: str,
        national_id: str,
        address: str,
        passport: Optional[str] = None
    ) -> int:
        """Encrypt and insert/update citizen record in vault."""
        blind_idx = compute_blind_index(national_id, self.hmac_key_hex)
        enc_nid = self.encrypt_field(national_id)
        enc_passport = self.encrypt_field(passport) if passport else None
        enc_address = self.encrypt_field(address)

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO citizens_vault (
                    blind_index, full_name, encrypted_national_id,
                    encrypted_passport, encrypted_address, updated_at
                ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(blind_index) DO UPDATE SET
                    full_name=excluded.full_name,
                    encrypted_national_id=excluded.encrypted_national_id,
                    encrypted_passport=excluded.encrypted_passport,
                    encrypted_address=excluded.encrypted_address,
                    updated_at=CURRENT_TIMESTAMP;
            """, (blind_idx, full_name, enc_nid, enc_passport, enc_address))
            conn.commit()
            return cursor.lastrowid

    def lookup_by_national_id(self, national_id: str) -> Optional[Dict[str, Any]]:
        """Find citizen record by blind index and decrypt sensitive fields."""
        blind_idx = compute_blind_index(national_id, self.hmac_key_hex)
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, blind_index, full_name, encrypted_national_id,
                       encrypted_passport, encrypted_address, created_at
                FROM citizens_vault
                WHERE blind_index = ?;
            """, (blind_idx,))
            row = cursor.fetchone()
            if not row:
                return None

            return {
                "id": row["id"],
                "blind_index": row["blind_index"],
                "full_name": row["full_name"],
                "national_id": self.decrypt_field(row["encrypted_national_id"]),
                "passport": self.decrypt_field(row["encrypted_passport"]),
                "address": self.decrypt_field(row["encrypted_address"]),
                "created_at": row["created_at"],
            }


if __name__ == "__main__":
    vault = CryptoVault()
    # Test sample citizen
    test_id = "63-2345678-R-42"
    rec_id = vault.store_citizen(
        full_name="Tendai Chidzero",
        national_id=test_id,
        address="14 Samora Machel Avenue, Harare, Zimbabwe",
        passport="FN123456"
    )
    print(f"[OK] Stored citizen with record ID: {rec_id}")
    fetched = vault.lookup_by_national_id(test_id)
    print(f"[OK] Looked up via Blind Index: {fetched['full_name']}")
    print(f"[OK] Decrypted National ID: {fetched['national_id']}")
    print(f"[OK] Decrypted Address: {fetched['address']}")
