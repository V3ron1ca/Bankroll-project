import os
import hashlib
from abc import ABC, abstractmethod


class Hash(ABC):
    @abstractmethod
    def create_hash_str(self, string):
        pass

    @abstractmethod
    def compare_hash(self, string, hash_str):
        pass


class HMACSHA512(Hash):
    def __init__(self, salt=None):
        if not salt:
            self.salt = os.urandom(64)
        else:
            self.salt = salt

    def create_hash_str(self, string):
        plaintext = string.encode()
        digest = hashlib.pbkdf2_hmac('sha512', plaintext, self.salt, 10000)
        return digest.hex()

    def compare_hash(self, string, hash_str):
        hash = self.create_hash_str(string)
        return hash_str == hash
