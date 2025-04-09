"use client";
import { Button, CloseButton, Drawer, Flex, Portal } from "@chakra-ui/react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { Icon } from "@chakra-ui/react";
import { BsBox2 } from "react-icons/bs";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { AiOutlineHeart } from "react-icons/ai";
import { CategoryItem, categories as categoryData } from "./categoryData";
import { useEffect, useState } from "react";
import Tablet_MobileProducts from "./Tablet_MobileProducts";
import Navigations from "./Navigations";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { logout } from '@/redux/slices/authSlice';
import Link from "next/link";

interface Product {
  id: number;
  slug: string;
  name: string;
  category: {
    main: string;
  };
}

type MenuItem = {
  icon: React.ReactElement;
  label: string;
  href?: string;
  onClick?: () => void;
};

const Tablet_Mobile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated, isAdmin } = useSelector(
    (state: RootState) => ({
      user: state.auth.user,
      isAuthenticated: state.auth.isAuthenticated,
      isAdmin: state.auth.isAdmin
    }),
    shallowEqual
  );

  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    router.refresh();
  };

  useEffect(() => {
    fetch("/api/auth/product")
      .then((res) => res.json()) 
      .then((data: { products: Product[] }) => {
        const categoryList = data.products.map((product) => product.category.main);
        const uniqueCategories = Array.from(new Set(categoryList));
        setProductCategories(uniqueCategories);
      })
      .catch((error) => console.error("Error fetching JSON:", error));
  }, []);

  const activeCategory = categoryData.find(
    (cat: CategoryItem) => cat.name === selectedCategory
  );

  // Create menu items based on authentication status
  const menuItems: MenuItem[] = [];
  if (!isAuthenticated) {
    menuItems.push(
      { icon: <BsPerson />, label: "Sign In", href: "/signin" },
      { icon: <BsPerson />, label: "Create Account", href: "/signup" }
    );
  } else {
    menuItems.push(
      { 
        icon: <BsPerson />, 
        label: isAdmin ? `Admin ${user?.username}` : user?.username || "My Account", 
        href: "/account" 
      },
      { icon: <AiOutlineHeart />, label: "Wishlist", href: "/wishlist" },
      { icon: <BsBox2 />, label: "Orders", href: "/orders" }
    );
    
    if (isAdmin) {
      menuItems.push({ icon: <BsPerson />, label: "Admin Dashboard", href: "/admin" });
    }
  }

  menuItems.push(
    { icon: <IoIosHelpCircleOutline />, label: "Help Center", href: "/help" }
  );

  if (isAuthenticated) {
    menuItems.push({ icon: <BsPerson />, label: "Logout", onClick: handleLogout });
  }

  menuItems.push(
    { icon: <IoIosHelpCircleOutline />, label: "Help Center", href: "/help" }
  );

  if (isAuthenticated) {
    menuItems.push({ icon: <BsPerson />, label: "Logout", onClick: handleLogout });
  }

  return (
    <div>
      <Drawer.Root placement={"start"}>
        <Drawer.Trigger asChild>
          <Button
            variant="ghost"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent", transform: "none" }}
            _focus={{ outline: "none", boxShadow: "none" }}
          >
            <AiOutlineMenu color="white" />
          </Button>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>
                <div className="flex flex-col gap-4 mt-3 p-6">
                    {menuItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 rounded-lg"
                        style={{ padding: "12px 16px" }}
                        onClick={item.onClick}
                      >
                        <Icon size="lg">{item.icon}</Icon>
                        {item.href ? (
                          <Link href={item.href} className="flex-1">
                            <span style={{ fontSize: "16px", fontWeight: "600" }}>
                              {item.label}
                            </span>
                          </Link>
                        ) : (
                          <span 
                            className="flex-1" 
                            style={{ fontSize: "16px", fontWeight: "600" }}
                          >
                            {item.label}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <div>
                  <Navigations />
                </div>
                <Flex>
                  <div className="p-6">
                    {productCategories.map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 gap-6 border-b"
                        style={{ padding: "12px 16px" }}
                      >
                        <button
                          className="cursor-pointer"
                          style={{ fontSize: "16px", fontWeight: "600" }}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </button>
                        {selectedCategory === category && activeCategory && (
                          <Tablet_MobileProducts subItems={activeCategory.subItems || []} />
                        )}
                      </div>
                    ))}
                  </div>
                </Flex>
              </Drawer.Body>
              <Drawer.Footer>
                
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </div>
  );
};

export default Tablet_Mobile;