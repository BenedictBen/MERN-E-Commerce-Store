"use client";
import { BsPerson } from "react-icons/bs";
import { Button, Drawer, Portal, Avatar, HStack, Icon } from "@chakra-ui/react";
import { AiOutlineHeart, AiOutlineProduct } from "react-icons/ai";
import { BsListUl } from "react-icons/bs";
import { BsBox2 } from "react-icons/bs";
import { IoIosHelpCircleOutline } from "react-icons/io";
import Link from "next/link";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
import { ReactElement, useState } from "react";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { clearCart } from "@/redux/slices/cartSlice";
import { clearWishlist } from "@/redux/slices/wishlistSlice";

type MenuItem = {
  icon: ReactElement;
  label: string;
  href?: string;
  onClick?: () => void;
};

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleOpenChange = (details: { open: boolean }) => {
    setIsOpen(details.open);
  };

  const { user, isAuthenticated, isAdmin } = useSelector(
    (state: RootState) => ({
      user: state.auth.user,
      isAuthenticated: state.auth.isAuthenticated,
      isAdmin: state.auth.isAdmin,
    }),
    shallowEqual
  );

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are included
      });

      // Remove the token from cookies
      document.cookie =
        "jwt=; Max-Age=0; path=/; secure; HttpOnly; sameSite=Lax";

      // Dispatch the logout action
      dispatch(clearCart());      // Clear cart items
      dispatch(clearWishlist());  // Clear wishlist items
      dispatch(logout());         // Clear auth state

      // Refresh the page or navigate to the login page
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Create menu items without conditional rendering in array
  const menuItems: MenuItem[] = [];

  if (!isAuthenticated) {
    menuItems.push(
      { icon: <BsPerson />, label: "Sign In", href: "/signin" },
      { icon: <BsPerson />, label: "Create Account", href: "/signup" }
    );
  } else if (isAdmin) {
    // Admin-specific menu items
    menuItems.push(
      { icon: <BsPerson />, label: "Profile"},
      { icon: <BsPerson />, label: "Users", href: "/admin/users" },
      { icon: <BsBox2 />, label: "Orders", href: "/admin/orders" },
      {
        icon: <AiOutlineProduct />,
        label: "Products",
        href: "/admin/products",
      },
      { icon: <BsListUl />, label: "Categories", href: "/admin/categories" }
    );
  } else {
    menuItems.push(
      { icon: <BsPerson />, label: "My Account" },
      { icon: <AiOutlineHeart />, label: "Wishlist", href: "/wishlist" },
      { icon: <BsBox2 />, label: "Track Orders", href: "/track-order" }
    );
  }

  menuItems.push({
    icon: <IoIosHelpCircleOutline />,
    label: "Help Center",
    href: "/help",
  });

  if (isAuthenticated) {
    menuItems.push({
      icon: <BsPerson />,
      label: "Logout",
      onClick: handleLogout,
    });
  }

  return (
    <Drawer.Root size="md" open={isOpen} onOpenChange={handleOpenChange}>
      <Drawer.Trigger asChild>
        <Button
          variant="ghost"
          _hover={{ bg: "transparent" }}
          _active={{ bg: "transparent", transform: "none" }}
          _focus={{ outline: "none", boxShadow: "none" }}
        >
          <HStack>
            <BsPerson color="white" />
            {isAuthenticated && (
              <span className="text-white text-sm">
                {isAdmin ? `Admin ${user?.username}` : user?.username}
              </span>
            )}
          </HStack>
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Body p={0}>
              <HStack
                mb="4"
                p={6}
                borderBottom="1px solid"
                borderColor="gray.100"
              >
                <Avatar.Root size="lg">
                  <Avatar.Fallback name={user?.username || "Guest"} />
                </Avatar.Root>
                <div>
                  <h3 className="font-semibold">
                    {isAuthenticated
                      ? isAdmin
                        ? `Admin ${user?.username}`
                        : user?.username
                      : "Guest"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {isAuthenticated ? user?.email : "Sign in to your account"}
                  </p>
                </div>
              </HStack>

              <div className="flex flex-col gap-4  mt-3 !p-6">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 rounded-lg"
                    onClick={item.onClick}
                    style={{
                      padding: "12px 16px",
                    }}
                  >
                    <Icon size="lg">{item.icon}</Icon>
                    {item.href ? (
                      <Link href={item.href} className="flex-1">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="flex-1">{item.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default UserMenu;
