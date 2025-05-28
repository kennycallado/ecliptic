DEFINE TABLE visits TYPE RELATION IN user OUT post | module SCHEMAFULL
  PERMISSIONS FULL;
DEFINE FIELD created ON visits TYPE option<datetime>
  VALUE $before OR time::now()
  PERMISSIONS FULL;


