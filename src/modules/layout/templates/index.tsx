import React from "react";

import Footer from "@modules/layout/templates/footer";
import Nav from "@modules/layout/templates/nav";

const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Nav params={{ locale: "en" }} />
      <main className="content-container flex-1 -mt-20">{children}</main>
      <Footer params={{ locale: "en" }} />
    </div>
  );
};

export default Layout;
