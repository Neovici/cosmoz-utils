# see https://nixos.wiki/wiki/Development_environment_with_nix-shell
{}:
with import (
  builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/0f5ce2f.tar.gz";
    sha256 = "0nkk492aa7pr0d30vv1aw192wc16wpa1j02925pldc09s9m9i0r3";
  }
) {};
mkShell {
  buildInputs = [ nodejs-12_x python3 firefox ];
  shellHook = ''
    export CHROME_BIN=${google-chrome}/bin/google-chrome-stable
    export PATH=$(npm bin):$PATH
  '';
}
