import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavbarActions from "./NavbarActions";
import NavLinks from "./NavLinks";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      <div className="border-b bg-background/75 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Logo />

          <NavLinks />

          <div className="flex items-center gap-2">
            <NavbarActions />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}