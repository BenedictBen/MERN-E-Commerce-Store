"use client"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }
  

  // create a table using chakra ui tables use v3.. table head should be id, name, email, Admin if its admin, the icon should be different from normal user, there should be another two buttons which comes after the header Admin but do not have a head. when icon is for editing the user info, the other is for deleting the user 