import React from "react";
import { icons, phrases } from "../../constants";
import { Link, Links } from "react-router";
import Widget from "./Widget";

const Footer: React.FC = () => {
  return (
    <footer className="px-[13rem] pt-[4rem] mt-[14rem] h-fit border-t-[0.5px] border-tertiary-100 border-opacity-20">
      <div className="py-[3.5rem] flex items-start justify-between border-b-[0.5px] border-tertiary-100 border-opacity-20">
        {/* short intro */}
        <div className="max-w-[26rem] h-fit px-2 text-tertiary-100">
          <p className="font-plight text-[0.9rem] text-justify leading-[1.8rem]">
            <span className="text-[1rem] font-pmedium mr-1">
              {phrases.footer[0].title}
            </span>
            {phrases.footer[0].description}
          </p>
          <div className="flex mt-5 gap-4">
            {phrases.footer[1].icon.map((iconKey, index) => (
              <Widget
                key={index}
                icon={icons[iconKey]}
                modalText={phrases.footer[1].text[index]}
              />
            ))}
          </div>
        </div>
        {/* quick links */}
        <div className="px-2 w-[13rem]">
          <h1 className="font-pmedium text-[1.4rem] text-tertiary-100">
            Quick Links
          </h1>
          <ul className="mt-3 flex flex-col gap-1">
            {phrases.footer[2].links.map((item, index) => (
              <Link key={index} to="/">
                {item}
              </Link>
            ))}
          </ul>
        </div>
      </div>
      <div className="py-[3rem] flex flex-col gap-3">
        <div className="flex justify-center">
          <img src={icons.logo} className="h-[1.5rem] w-[1.5rem]" alt="logo" />
        </div>
        <p className="text-[0.9rem] font-plight text-center">
          {phrases.footer[3].footerText}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
