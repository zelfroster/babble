import { Button } from "@components/ui/button";
import { MdExitToApp } from "react-icons/md";

const Header = () => {
  return (
    <header className="flex justify-between items-center py-2 mb-4">
      <p className="font-bold text-2xl">Babble</p>
      <Button className="!h-8 flex gap-1">
        Quit <MdExitToApp />
      </Button>
    </header>
  );
};

export default Header;
