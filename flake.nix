
{
  description = "A simple Node.js project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
      };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_latest
          nodePackages_latest.eslint
          # nodePackages_latest.mocha
        ];
        shellHook = ''
        echo "simple nodejs"
        '';
      };
    };
}
