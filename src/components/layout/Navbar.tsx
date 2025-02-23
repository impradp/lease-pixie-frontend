import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="w-full max-w-[1328px] mx-auto px-4">
      <div className="h-[92px] flex-col justify-start items-start gap-4">
        <div className="self-stretch h-[52px] py-3.5 rounded-xl">
          <div className="self-stretch justify-between items-end flex">
            <div className="flex items-center gap-2">
              <div>
                <Image
                  src="/icons/lease-pixie-logo.svg"
                  alt="Lease Pixie Logo"
                  width={16}
                  height={18}
                />
              </div>
              <span className="font-myanmar-khyay text-lg text-[#0b111d]">
                Lease Pixie
              </span>
            </div>

            {/* Menu Button */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Image
                src="/icons/hamburger.svg"
                alt="menu-01"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const BreadcrumbLink = ({ href, text }: { href: string; text: string }) => (
  <Link
    href={href}
    className="text-[#0f1728] text-base font-medium font-inter leading-normal hover:text-blue-600 transition-colors"
  >
    {text}
  </Link>
);

export default Navbar;
