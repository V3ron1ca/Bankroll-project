

class Blacklist:
    def __init__(self):
        self.tokens = set()

    def add_token(self, token):
        self.tokens.add(token)

    def token_exists(self, token):
        return token in self.tokens
