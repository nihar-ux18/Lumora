from app.core.security import (
    create_access_token,
    decode_token,
    hash_password,
    verify_password,
)

hashed = hash_password("Password123!")

print(hashed)
print(verify_password("Password123!", hashed))

token = create_access_token("12345")

print(token)
print(decode_token(token))
