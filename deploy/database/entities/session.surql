DEFINE TABLE OVERWRITE session TYPE NORMAL SCHEMALESS;
DEFINE FIELD OVERWRITE ipAddress ON session TYPE option<string>
  ASSERT $value = NONE OR string::is::ip($value)
  VALUE $value OR session::ip();
