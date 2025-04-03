# Kenny

-
-
-
-
-
-
-

```sh
set LD_LIBRARY_PATH $(nix path-info nixpkgs#stdenv.cc.cc.lib)/lib:$LD_LIBRARY_PATH
```

## NOTE:

> [!IMPORTANT]
> Because of baseUrl docker-compose does not work while developing locally.
