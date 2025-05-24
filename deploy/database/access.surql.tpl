DEFINE USER IF NOT EXISTS {{SECRET_DB_USERNAME}} ON DATABASE PASSWORD "{{SECRET_DB_PASSWORD}}"
  ROLES EDITOR DURATION FOR TOKEN 1d, FOR SESSION 12h;

DEFINE ACCESS IF NOT EXISTS users ON DATABASE TYPE RECORD
  SIGNIN (SELECT * FROM user
    WHERE email = $email
      AND record::exists(<record> $sessionId)
      AND id = (SELECT VALUE userId FROM ONLY <record> $sessionId)
      AND session::ip() = (SELECT VALUE ipAddress FROM ONLY <record> $sessionId)
  )
  WITH JWT ALGORITHM HS512 KEY '{{SECRET_DB_KEY}}'
  WITH ISSUER KEY '{{SECRET_DB_KEY}}' DURATION FOR TOKEN 7d, FOR SESSION NONE;

LET $user = UPSERT user MERGE {
  banned: false,
  createdAt: time::now(),
  email: '{{SECRET_ADMIN_EMAIL}}',
  emailVerified: true,
  name: 'Admin',
  role: 'admin',
  updatedAt: time::now(),
} WHERE email = '{{SECRET_ADMIN_EMAIL}}';

UPSERT account MERGE {
  accountId: $user[0].id,
  createdAt: time::now(),
  password: crypto::argon2::generate('{{SECRET_ADMIN_PASSWORD}}'),
  providerId: 'credential',
  updatedAt: time::now(),
  userId: $user[0].id,
} WHERE userId = $user[0].id;
