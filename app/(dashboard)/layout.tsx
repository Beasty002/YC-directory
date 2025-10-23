import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <h3 className="text-red-800">Dashboard</h3>
      {children}
    </div>
  );
};

export default layout;
